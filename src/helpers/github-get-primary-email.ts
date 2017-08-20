import { find } from 'lodash';
import * as Github from 'github';
import { GithubResponse } from './interfaces';

type EmailResponse = {
  email: string;
  primary: boolean;
  verified: boolean;
};

export default async (client: Github) => {
  const emails: GithubResponse<[EmailResponse]> = await client.users.getEmails({ page: 1, per_page: 100 });
  const email = find<EmailResponse>(emails.data, { primary: true, verified: true });

  if (!email) {
    throw new Error('primary_email_not_found');
  }

  return email;
};
