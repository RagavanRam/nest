export interface FormInterface {
  id: number;
  name: string;
  config: JSON;
  status: boolean;
  emailTemplate: string;
  createdAt: Date;
  updatedAt: Date;
}
