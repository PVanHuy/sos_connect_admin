import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { App } from 'antd'
import { useForm } from 'react-hook-form'
import { getUserFacingErrorMessage, toAppError } from '../../../lib/api/errors'
import { sendBroadcast } from '../api/broadcast.api'
import { broadcastSchema, type BroadcastFormValues } from '../schemas/broadcast.schema'

export function useBroadcastForm() {
  const { message } = App.useApp()

  const form = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: {
      title: '',
      content: '',
      image_url: '',
    },
  })

  const mutation = useMutation({
    mutationFn: sendBroadcast,
    onSuccess: (result) => {
      const detail =
        result.sent != null && result.totalUsers != null
          ? ` (${result.sent}/${result.totalUsers} người dùng)`
          : ''
      message.success(`${result.message}${detail}`)
      form.reset()
    },
    onError: (error) => {
      message.error(getUserFacingErrorMessage(toAppError(error)))
    },
  })

  function onSubmit(values: BroadcastFormValues) {
    mutation.mutate(values)
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: mutation.isPending,
  }
}
