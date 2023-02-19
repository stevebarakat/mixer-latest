import { db } from "~/utils/db.server";
import type { ActionFunction } from "@remix-run/node";
import { getSessionUser } from "~/utils/session.server";
import slugify from "react-slugify";
import { redirect } from "@remix-run/node";
import { v4 as uuid } from "uuid";

export const action: ActionFunction = async ({ request }) => {
  const sessionUser = await getSessionUser(request);
  if (!sessionUser) return;
  const form = await request.formData();
  const actionName = form.get("actionName");
  const id = form.get("id");

  switch (actionName) {
    case "changeMixName":
      const name = form.get("name");
      if (typeof name !== "string" || typeof id !== "string") return;
      await db.mixSettings.update({
        where: {
          id,
        },
        data: {
          mixName: name,
        },
      });
      break;

    case "fork":
      // Get source mix's "master" settings
      const mixSettingsId = form.get("mixSettingsId");
      if (typeof mixSettingsId !== "string") return;
      const mixSettingsFork = await db.mixSettings.findFirst({
        where: {
          id: mixSettingsId,
        },
      });

      // Clone source mix's "master" settings
      const newMixSettingsId = uuid();
      const mixName = `${mixSettingsFork?.mixName}-forked`;
      mixSettingsFork!.id = newMixSettingsId;
      mixSettingsFork!.userId = sessionUser.id;
      mixSettingsFork!.userName = sessionUser.userName;
      mixSettingsFork!.mixName = mixName;

      // TODO ts
      await db.mixSettings.create({
        data: mixSettingsFork,
      });

      // Get source mix's "track" settings
      const trackSettingsFork = await db.trackSettings.findMany({
        where: { mixSettingsId },
      });

      // Clone source mix's "track" settings
      trackSettingsFork.map(async (trackSetting, i) => {
        return await db.trackSettings.create({
          data: {
            ...trackSettingsFork[i],
            mixName,
            id: uuid(),
            mixSettingsId: newMixSettingsId,
            trackSettingsId: uuid(),
            songSlug: trackSetting.songSlug,
            userId: sessionUser.id,
          },
        });
      });

      // Navigate to new forked mix
      return redirect(
        `${slugify(sessionUser.userName)}/${mixName}/${newMixSettingsId}`
      );

    case "delete":
      if (typeof id !== "string") return;
      await db.mixSettings.delete({
        where: {
          id,
        },
      });
      break;

    case "togglePrivacy":
      const index: string | File | null = form.get("index");
      const isPrivate: string | File | null = form.get("isPrivate");

      if (
        typeof index !== "string" ||
        typeof isPrivate !== "string" ||
        typeof id !== "string"
      )
        return;

      await db.mixSettings.update({
        where: {
          id,
        },
        data: {
          private: JSON.parse(isPrivate)[index],
        },
      });
      break;

    case "updateLikes":
      if (typeof id !== "string") return;
      const likes: null | File | string | number = form.get("likes");
      if (typeof likes !== "string") return;
      await db.mixSettings.update({
        where: {
          id,
        },
        data: {
          likes: parseInt(likes, 10),
        },
      });
      break;

    default:
      throw new Response(`Unknown action ${actionName}`, { status: 400 });
  }
  return null;
};
