import { GuildApplicationCommandPermissionData } from "discord.js";
import { SetPermissions } from "../typings/Command.type";

export const setGuildPermissions = ({
  commandCollection,
  commands,
  guild,
}: SetPermissions) => {
  const getRoles = (commandName: string) => {
    const perms = commands.find((c) => c.name === commandName).userPermissions;
    if (!perms) return null;
    return guild.roles.cache.filter(
      (role) => role.permissions.has(perms) && !role.managed
    );
  };

  const fullPermissions: GuildApplicationCommandPermissionData[] =
    commandCollection?.reduce((acc, cmd) => {
      const roles = getRoles(cmd.name);
      if (!roles) return acc;
      const permissions = roles?.reduce((a, role) => {
        return [...a, { id: role.id, type: "ROLE", permission: true }];
      }, []);

      return [...acc, { id: cmd.id, permissions }];
    }, []);

  guild.commands.permissions.set({ fullPermissions });
};
