import { Card, Form, Input } from 'antd'
import { Controller } from 'react-hook-form'
import { PageHeader } from '../../../components/shared/PageHeader'
import { CustomButton } from '../../../components/ui/CustomButton'
import { useBroadcastForm } from '../hooks/useBroadcastForm'

export function SettingsPage() {
  const { form, onSubmit, isSubmitting } = useBroadcastForm()
  const {
    control,
    formState: { errors },
  } = form

  return (
    <>
      <PageHeader
        title="Cài đặt"
        description="Gửi thông báo hệ thống tới tất cả người dùng qua API /admin/broadcast."
      />
      <Card title="Gửi thông báo toàn hệ thống" style={{ maxWidth: 720 }}>
        <Form layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Tiêu đề"
            validateStatus={errors.title ? 'error' : undefined}
            help={errors.title?.message}
            required
          >
            <Controller
              name="title"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Thông báo hệ thống" />}
            />
          </Form.Item>
          <Form.Item
            label="Nội dung"
            validateStatus={errors.content ? 'error' : undefined}
            help={errors.content?.message}
            required
          >
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  rows={4}
                  placeholder="Hệ thống sẽ bảo trì vào 22h hôm nay"
                />
              )}
            />
          </Form.Item>
          <Form.Item
            label="URL ảnh (tuỳ chọn)"
            validateStatus={errors.image_url ? 'error' : undefined}
            help={errors.image_url?.message}
          >
            <Controller
              name="image_url"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="https://example.com/banner.jpg" />
              )}
            />
          </Form.Item>
          <CustomButton
            buttonText="Gửi thông báo"
            htmlType="submit"
            isLoading={isSubmitting}
            onPressed={onSubmit}
          />
        </Form>
      </Card>
    </>
  )
}
