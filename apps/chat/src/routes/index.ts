import * as chat from './chat';
import * as compose from './compose';
import * as media from './media';
import * as members from './members';
import * as messages from './messages';
import * as reactions from './reactions';
import * as realtime from './realtime';

export const routes = {
	chat,
	compose,
	media,
	members,
	messages,
	reactions,
	realtime,
};

export const modules = [
	chat.module,
	compose.module,
	media.module,
	members.module,
	messages.module,
	reactions.module,
	realtime.module,
];
