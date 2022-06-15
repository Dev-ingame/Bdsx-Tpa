import { events } from "bdsx/event";
import { ActorCommandSelector, CommandPermissionLevel, PlayerCommandSelector } from "bdsx/bds/command";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { Player, ServerPlayer } from "bdsx/bds/player";
import { bedrockServer } from "bdsx/launcher";
import { networkInterfaces } from "os";
import { command } from "bdsx/command";
import { CANCEL } from "bdsx/common";
import * as fs from "fs";


let tpa: any = {};

function CreateJson(filepath: string, value = {}) {
    if (!fs.existsSync(filepath)) {
        fs.writeFileSync(filepath, JSON.stringify(value));
        console.log("tpa.json created");
    }
}

CreateJson(`tpa.json`);

command.register("tpa", "Make Tp request.").overload((param, origin, output) => {
    const actor = origin.getName();
        for (const player of param.target.newResults(origin, ServerPlayer)) {
            tpa[player.getName()] = actor
            let ni = player.getNetworkIdentifier()
            fs.writeFileSync(`tpa.json`, JSON.stringify(tpa), "utf8")
            bedrockServer.executeCommand(`tellraw "${actor}" {"rawtext":[{"text":"§l§d${player.getName()}Sent TP request to §e"}]}`)
            bedrockServer.executeCommand(`tellraw "${player.getName()}" {"rawtext":[{"text":"§l§d${actor}§e has sent you a tp request and it will be cancelled after 30 seconds.§b\n do /tpaccept To accept"}]}`)
        }
    }, {
        target: PlayerCommandSelector,
    });

command.register("tpadeny", "Deny Tp.").overload((param, origin, op) => {
    const actor = origin.getEntity();
    if (actor?.isPlayer) {
        let ni = actor.getNetworkIdentifier()
        const tpas = JSON.parse(fs.readFileSync(`tpa.json`, "utf8"));
        tpa[actor.getName()] = ""
        fs.writeFileSync(`tpa.json`, JSON.stringify(tpa), "utf8")
    }
}, {
    target: PlayerCommandSelector
})

command.register("tpaccept", "Accept Tp.").overload((param, o, op) => {
    const player = o.getEntity();
    if (player?.isPlayer) {
        let ni = player.getNetworkIdentifier()
        const tpas = JSON.parse(fs.readFileSync(`tpa.json`, "utf8"));
        if (tpas[ni.getActor()!.getName()] !== "") {
            bedrockServer.executeCommand(`tp "${tpa[ni.getActor()!.getName()]}" ${player.getName()}`)
            bedrockServer.executeCommand(`tellraw "${tpa[ni.getActor()!.getName()]}" {"rawtext":[{"text":"§l§e${player.getName()}§a has been tp."}]}`)
            tpa[player.getName()] = ""
            fs.writeFileSync(`tpa.json`, JSON.stringify(tpa), "utf8")
        }
        if (tpas[ni.getActor()!.getName()] == "") {
            bedrockServer.executeCommand(`tellraw "${player.getName()}" {"rawtext":[{"text":"§l There is no Tp request."}]}`)
        }
    }
}, {});

