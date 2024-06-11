import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ReportInput } from '../page';
import { FormInput, schema } from './schema';

export function useReportForm(props: ReportInput) {
  return useForm<FormInput>({
    defaultValues: {
      targetId: props.id,
      targetType: props.type,
      reason: '',
      comment: null,
    },
    resolver: zodResolver(schema),
  });
}
