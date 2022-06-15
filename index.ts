

import { events } from "bdsx/event";
import { ActorCommandSelector, CommandPermissionLevel, PlayerCommandSelector } from "bdsx/bds/command";
import { MinecraftPacketIds } from "bdsx/bds/packetids";
import { ServerPlayer } from "bdsx/bds/player";
import { bedrockServer } from "bdsx/launcher";
import { command } from "bdsx/command";
import { CANCEL } from "bdsx/common";

import * as fs from "fs";

if (bedrockServer.isLaunched()) {
    import("./tpa");
} else {
    events.serverOpen.on(() => {
    import("./tpa");
    });
}

events.serverOpen.on(()=>{
    console.log('Tpa has been disable');
});

events.serverClose.on(()=>{
    console.log('Tpa has been disable');
});

console.log('Tpa Has Enabled');