import { withPluginApi } from "discourse/lib/plugin-api";
import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";

export default {
  name: "toggle-whispers",
  initialize() {
    withPluginApi("0.1", whisperInit);
  },
};

const whisperInit = (api) => {
  const currentUser = api.getCurrentUser();
  if (currentUser && currentUser.staff) {
    api.attachWidgetAction("post-menu", "toggleWhisper", function () {
      const model = this.attrs;
      let newType = model.post_type === 1 ? 4 : 1;

      ajax(`/posts/${model.id}/post_type`, {
        type: "PUT",
        data: {
          post_type: newType,
        },
      }).catch(popupAjaxError);
    });

    api.addPostMenuButton("toggleWhisper", (model) => {
      let isWhisper = model.post_type === 4;
      let icon = isWhisper ? "far-eye" : "far-eye-slash";
      let title = isWhisper
        ? "toggle_button_title.regular"
        : "toggle_button_title.whisper";
      return {
        action: "toggleWhisper",
        icon: icon,
        title: themePrefix(title),
        position: "second-last-hidden",
      };
    });
  }
};
