import { createReader } from '@keystatic/core/reader';
import WelcomeTextClient from './WelcomeText.client';
import keystaticConfig from '../../keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);

export default async function WelcomeText() {
  const content = await reader.singletons.labWelcome.read();

  if (!content || content.messages.length === 0) {
    return null;
  }

  return (
    <WelcomeTextClient
      supervisorLabel={content.supervisorLabel}
      messages={content.messages}
    />
  );
}
