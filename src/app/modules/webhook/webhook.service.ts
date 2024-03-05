import httpStatus from 'http-status';
import OpenAI from 'openai';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

/* eslint-disable @typescript-eslint/no-explicit-any */
const payStackUserPaySuccess = async (userId: string) => {
  const isUserExist = await prisma.user.findUnique({ where: { id: userId } });
  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found to update!');
  }
  const upateUser = await prisma.user.update({
    where: { id: userId },
    data: { isPaid: true },
  });
  return upateUser;
  //   return datas;
};
const openai = new OpenAI({
  apiKey: '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',
});
const threadByUser: any = {};
const aiSupport = async (userId: string, message: string) => {
  const assistantIdToUse = 'asst_wB7w7PFzXSmVYqa2inyrphEi'; // Replace with your assistant ID
  // Spec // You should include the user ID in the request

  // Create a new thread if it's the user's first message
  if (!threadByUser[userId]) {
    try {
      const myThread = await openai.beta.threads.create();
      console.log('New thread created with ID: ', myThread.id, '\n');
      threadByUser[userId] = myThread.id; // Store the thread ID for this user
    } catch (error) {
      console.error('Error creating thread:', error);
      throw new ApiError(httpStatus.BAD_REQUEST, 'Try again');
    }
  }

  const userMessage = message;

  // Add a Message to the Thread
  try {
    const myThreadMessage = await openai.beta.threads.messages.create(
      threadByUser[userId], // Use the stored thread ID for this user
      {
        role: 'user',
        content: userMessage,
      }
    );
    console.log('This is the message object: ', myThreadMessage, '\n');

    // Run the Assistant
    const myRun = await openai.beta.threads.runs.create(
      threadByUser[userId], // Use the stored thread ID for this user
      {
        assistant_id: assistantIdToUse,
        // Your instructions here
        tools: [
          { type: 'code_interpreter' }, // Code interpreter tool
          { type: 'retrieval' }, // Retrieval tool
        ],
      }
    );
    console.log('This is the run object: ', myRun, '\n');

    // Periodically retrieve the Run to check on its status
    const retrieveRun = async () => {
      let keepRetrievingRun;

      while (myRun.status !== 'completed') {
        keepRetrievingRun = await openai.beta.threads.runs.retrieve(
          threadByUser[userId], // Use the stored thread ID for this user
          myRun.id
        );

        if (keepRetrievingRun.status === 'completed') {
          console.log('\n');
          break;
        }
      }
    };
    await retrieveRun();

    // Retrieve the Messages added by the Assistant to the Thread
    const waitForAssistantMessage = async () => {
      await retrieveRun();

      const allMessages = await openai.beta.threads.messages.list(
        threadByUser[userId] // Use the stored thread ID for this user
      );

      // Send the response back to the front end

      console.log(
        '------------------------------------------------------------ \n'
      );

      if (allMessages.data[0].content[0].type === 'text') {
        return allMessages.data[0].content[0].text.value;
      }
      throw new ApiError(httpStatus.BAD_REQUEST, 'something went wrong');
    };
    return await waitForAssistantMessage();
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'something went wrong!');
  }
  //   return datas;
};

export const webHookService = {
  payStackUserPaySuccess,
  aiSupport,
};
