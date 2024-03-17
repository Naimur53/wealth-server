import * as OneSignal from 'onesignal-node';
import { CreateNotificationBody } from 'onesignal-node/lib/types';
import config from '../config';

const client = new OneSignal.Client(config.oneSignalID, config.oneSignalApi);

// Define notification content

// Send the notification

const sendNotification = async ({ message }: { message: string }) => {
  const notification: CreateNotificationBody = {
    contents: {
      en: message,
    },
    // include_player_ids: ['DEVICE_TOKEN_HERE'], // Replace DEVICE_TOKEN_HERE with the device token
    included_segments: ['All'],
  };
  client
    .createNotification(notification)
    .then(response => {
      console.log(response.body);
    })
    .catch(error => {
      console.error(error);
    });
};
export default sendNotification;
