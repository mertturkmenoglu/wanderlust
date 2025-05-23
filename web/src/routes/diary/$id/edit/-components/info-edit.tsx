import InputInfo from '@/components/kit/input-info';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { lengthTracker } from '@/lib/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getRouteApi } from '@tanstack/react-router';
import { formatDate, isFuture } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z
  .object({
    title: z.string().min(1).max(128),
    description: z.string().min(0).max(4096),
    date: z.string(),
    shareWithFriends: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (isFuture(data.date)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Date must be in the past',
        path: ['date'],
        fatal: true,
      });

      return z.NEVER;
    }
  });

const dateFormat = 'yyyy-MM-dd';

export function InfoEdit() {
 
}
