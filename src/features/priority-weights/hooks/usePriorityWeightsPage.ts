import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { App } from 'antd'
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { getUserFacingErrorMessage, toAppError } from '../../../lib/api/errors'
import { fetchPriorityWeights, savePriorityWeights } from '../api/weights.api'

const weightsFormSchema = z
  .object({
    items: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        key: z.string(),
        description: z.string(),
        value: z.number().min(0).max(100),
      }),
    ),
  })
  .refine((value) => value.items.reduce((sum, item) => sum + item.value, 0) === 100, {
    message: 'Tổng trọng số phải bằng 100%.',
    path: ['items'],
  })

export type WeightsFormValues = z.infer<typeof weightsFormSchema>

export function usePriorityWeightsPage() {
  const { message } = App.useApp()
  const form = useForm<WeightsFormValues>({
    resolver: zodResolver(weightsFormSchema),
    defaultValues: { items: [] },
  })

  const query = useQuery({
    queryKey: ['priority-weights', 'list'],
    queryFn: fetchPriorityWeights,
  })

  const fields = useFieldArray({
    control: form.control,
    name: 'items',
  })

  useEffect(() => {
    if (query.data) {
      form.reset({ items: query.data })
    }
  }, [form, query.data])

  const saveMutation = useMutation({
    mutationFn: savePriorityWeights,
    onSuccess: (data) => {
      form.reset({ items: data })
      message.success('Đã lưu cấu hình trọng số.')
    },
    onError: (error) => {
      message.error(getUserFacingErrorMessage(toAppError(error)))
    },
  })

  const total = form.watch('items').reduce((sum, item) => sum + item.value, 0)

  return {
    form,
    fields,
    total,
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage: query.error ? getUserFacingErrorMessage(toAppError(query.error)) : undefined,
    isSaving: saveMutation.isPending,
    onSubmit: form.handleSubmit((values) => saveMutation.mutate(values.items)),
  }
}
