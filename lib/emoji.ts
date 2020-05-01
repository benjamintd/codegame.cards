import { EmojiConvertor } from "emoji-js";

const emoji = new EmojiConvertor();
emoji.replace_mode = "img";
emoji.img_sets.apple.path = "/emoji-apple-64/";

export { emoji }
