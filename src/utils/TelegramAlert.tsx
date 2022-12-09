import { User } from "firebase/auth";

export default function telegramAlert(user: User) {
  fetch(
    `https://api.telegram.org/bot5531898247:AAG8rxOFIKmlwS6PYBVTuXdTGMqIaSpl5eE/sendMessage?chat_id=231233238&text=new visit to tcgstock.me:${
      user ? user.displayName : "unknown"
    }, on  ${new Date()} `
  );
}
