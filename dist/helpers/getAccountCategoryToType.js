"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountCategoryToType = void 0;
const accountCategoryToType = (category) => {
    switch (category) {
        case 'Facebook':
        case 'Twitter':
        case 'Instagram':
        case 'LinkedIn':
        case 'Pinterest':
        case 'Snapchat':
        case 'TikTok':
        case 'YouTube':
        case 'GoogleVoice':
        case 'Threads':
        case 'Telegram':
        case 'Whatsapp':
            return 'SocialMedia';
        case 'Playstation':
        case 'CallOfDuty':
        case 'Pubg':
        case 'Steam':
            return 'Game';
        case 'Gmail':
        case 'Ymail':
        case 'Hotmail':
        case 'MailRu':
        case 'Outlook':
            return 'Email';
        case 'Windscribe':
        case 'Nord':
        case 'Vpn911':
            return 'Vpn';
        case 'Other':
            return 'Other';
        default:
            return 'Other';
    }
};
exports.accountCategoryToType = accountCategoryToType;
