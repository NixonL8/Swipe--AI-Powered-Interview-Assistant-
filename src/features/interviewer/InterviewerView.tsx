import { useMemo, useState } from 'react'
import {
  Badge,
  Card,
  Col,
  Collapse,
  Descriptions,
  Input,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useAppDispatch, useAppSelector } from '@/app/hook'
import {
  selectCandidateById,
  selectDashboardRows,
} from '@/features/candidates/selectors'
import {
  setDashboardFilters,
  setLastViewedCandidate,
} from '@/features/ui/uiSlice'
import type { CandidateRecord } from '@/types'
import ChatMessages from '@/components/messages'

const { Title, Paragraph } = Typography
const { Panel } = Collapse

interface TableRow {
  key: string
  name: string
  email: string
  score: number
  status: string
  updatedAt: string
}

const statusColor: Record<string, string> = {
  collecting: 'gold',
  'awaiting-start': 'blue',
  'in-progress': 'geekblue',
  paused: 'orange',
  completed: 'green',
}

export function InterviewerView() {
  const dispatch = useAppDispatch()
  const candidates = useAppSelector(selectDashboardRows)
  const filters = useAppSelector((state) => state.ui.dashboardFilters)
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null)

  const selectedCandidate = useAppSelector((state) =>
    selectedCandidateId
      ? selectCandidateById(selectedCandidateId)(state)
      : undefined,
  )

  const dataSource: TableRow[] = useMemo(
    () =>
      candidates.map((candidate) => ({
        key: candidate.id,
        name: candidate.profile.name ?? 'Unknown candidate',
        email: candidate.profile.email ?? '—',
        score: candidate.summary?.overallScore ?? 0,
        status: candidate.interview.status,
        updatedAt: candidate.updatedAt,
      })),
    [candidates],
  )

  const columns: ColumnsType<TableRow> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (value: string) => <strong>{value}</strong>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (value: number) => `${value || 0}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: string) => (
        <Tag color={statusColor[value] ?? 'default'}>{value.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Last update',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (value: string) => dayjs(value).format('MMM D, HH:mm'),
    },
  ]

  return (
    <div className="interviewer-view" style={{ display: 'flex', height: '100%' }}>
      {/* Left Panel */}
      <div style={{ flex: 1, padding: 16, borderRight: '1px solid #f0f0f0', overflowY: 'auto' }}>
        <Card style={{ marginBottom: 16 }}>
          <Title level={4}>Interview Dashboard</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Input.Search
                placeholder="Search by name or email"
                value={filters.searchTerm}
                onChange={(event) =>
                  dispatch(setDashboardFilters({ searchTerm: event.target.value }))
                }
                allowClear
              />
            </Col>
            <Col xs={24} md={8}>
              <Select
                value={filters.sortBy}
                style={{ width: '100%' }}
                onChange={(value) => dispatch(setDashboardFilters({ sortBy: value }))}
                options={[
                  { label: 'Score (high → low)', value: 'score-desc' },
                  { label: 'Score (low → high)', value: 'score-asc' },
                  { label: 'Most recent', value: 'recent' },
                ]}
              />
            </Col>
          </Row>
        </Card>

        <Card>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{ pageSize: 6 }}
            onRow={(record) => ({
              onClick: () => {
                setSelectedCandidateId(record.key)
                dispatch(setLastViewedCandidate(record.key))
              },
            })}
            rowClassName="clickable-row"
          />
        </Card>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 2, padding: 16, overflowY: 'auto' }}>
        {selectedCandidate ? (
          <CandidateDetails candidate={selectedCandidate} />
        ) : (
          <Card>
            <Title level={4}>Select a candidate to view details</Title>
            <Paragraph>Click on a candidate from the list to see their details here.</Paragraph>
          </Card>
        )}
      </div>
    </div>
  )
}

interface CandidateDetailsProps {
  candidate: CandidateRecord
}

function CandidateDetails({ candidate }: CandidateDetailsProps) {
  const summary = candidate.summary

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      {/* Candidate Overview */}
      <Card title="Candidate Overview">
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Email">{candidate.profile.email ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="Phone">{candidate.profile.phone ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Badge
              status="processing"
              color={statusColor[candidate.interview.status] ?? 'default'}
              text={candidate.interview.status}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Last update">
            {dayjs(candidate.updatedAt).format('MMM D, YYYY HH:mm')}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* AI Summary */}
      {summary && (
        <Card title="AI Summary">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Statistic title="Final score" value={summary.overallScore} suffix="/ 100" />
            </Col>
            <Col span={12}>
              <Paragraph>{summary.finalRemark}</Paragraph>
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
            <Col span={12}>
              <Title level={5}>Strengths</Title>
              {summary.strengths.map((item) => (
                <Tag key={item} color="green">
                  {item}
                </Tag>
              ))}
            </Col>
            <Col span={12}>
              <Title level={5}>Areas to improve</Title>
              {summary.areasToImprove.map((item) => (
                <Tag key={item} color="orange">
                  {item}
                </Tag>
              ))}
            </Col>
          </Row>
        </Card>
      )}

      {/* Chat History */}
      <Card title="Chat History" bodyStyle={{ maxHeight: 320, overflow: 'auto' }}>
        <ChatMessages messages={candidate.chat} />
      </Card>

      {/* Full Transcript */}
      <Card title="Full Transcript">
        <Collapse accordion>
          {candidate.interview.questions.map((question, index) => {
            const answer = candidate.interview.answers.find(
              (item) => item.questionId === question.id,
            )
            return (
              <Panel header={`Question ${index + 1} · ${question.difficulty.toUpperCase()}`} key={question.id}>
                <Paragraph>{question.prompt}</Paragraph>
                <Paragraph type="secondary">
                  Expected keywords:{' '}
                  {question.expectedKeywords?.length
                    ? question.expectedKeywords.join(', ')
                    : '—'}
                </Paragraph>
                {answer ? (
                  <>
                    <Paragraph>
                      <strong>Candidate:</strong> {answer.response || '(no answer)'}
                    </Paragraph>
                    <Paragraph>
                      <strong>Score:</strong> {answer.score} ·{' '}
                      {dayjs(answer.submittedAt).format('HH:mm:ss')}
                    </Paragraph>
                    <Paragraph type="secondary">{answer.reasoning}</Paragraph>
                  </>
                ) : (
                  <Paragraph>Not answered.</Paragraph>
                )}
              </Panel>
            )
          })}
        </Collapse>
      </Card>
    </Space>
  )
}

export default InterviewerView
