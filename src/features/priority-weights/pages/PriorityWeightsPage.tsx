import { Card, Slider, Space, Typography } from 'antd'
import { Controller } from 'react-hook-form'
import { PageHeader } from '../../../components/shared/PageHeader'
import { QueryState } from '../../../components/shared/QueryState'
import { CustomButton } from '../../../components/ui/CustomButton'
import { formatPercent } from '../../../utils/format'
import { usePriorityWeightsPage } from '../hooks/usePriorityWeightsPage'

export function PriorityWeightsPage() {
  const { form, fields, total, isLoading, isError, errorMessage, isSaving, onSubmit } =
    usePriorityWeightsPage()

  return (
    <>
      <PageHeader
        title="Trọng số ưu tiên"
        description="Điều chỉnh cách hệ thống ưu tiên đội cứu hộ. Tổng phải bằng 100%."
        extra={<Typography.Text strong>Tổng: {formatPercent(total)}</Typography.Text>}
      />
      <QueryState isLoading={isLoading} isError={isError} errorMessage={errorMessage} isEmpty={!fields.fields.length}>
        <form onSubmit={onSubmit}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            {fields.fields.map((field, index) => (
              <Card key={field.id} title={field.name}>
                <Typography.Paragraph type="secondary">{field.description}</Typography.Paragraph>
                <Controller
                  control={form.control}
                  name={`items.${index}.value`}
                  render={({ field: sliderField }) => (
                    <Slider
                      min={0}
                      max={100}
                      value={sliderField.value}
                      onChange={sliderField.onChange}
                    />
                  )}
                />
                <Typography.Text>{formatPercent(form.watch(`items.${index}.value`) ?? 0)}</Typography.Text>
              </Card>
            ))}
            {form.formState.errors.items?.root?.message ? (
              <Typography.Text type="danger">{form.formState.errors.items.root.message}</Typography.Text>
            ) : null}
            {form.formState.errors.items?.message ? (
              <Typography.Text type="danger">{form.formState.errors.items.message}</Typography.Text>
            ) : null}
            <CustomButton
              htmlType="submit"
              isFullWidth={false}
              buttonText="Lưu cấu hình"
              isLoading={isSaving}
              disabled={total !== 100}
            />
          </Space>
        </form>
      </QueryState>
    </>
  )
}
