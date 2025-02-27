
export interface FormField {
  key: string;
  value: string;
}

export interface HeadersFormProps {
  fields: FormField[];
  onFieldsChange: (fields: FormField[]) => void;
}

export interface QueryParamsFormProps {
  fields: FormField[];
  onFieldsChange: (fields: FormField[]) => void;
}

export interface BodyFormProps {
  isFormData: boolean;
  fields: FormField[];
  rawBody: string;
  onFieldsChange: (fields: FormField[]) => void;
  onRawBodyChange: (body: string) => void;
  onIsFormDataChange: (isFormData: boolean) => void;
}
