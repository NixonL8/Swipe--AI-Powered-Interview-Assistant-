import { Modal, Typography } from 'antd'
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hook'
import { selectCandidateById } from '@/features/candidates/selectors'
import { resumeInterview } from '@/features/candidates/validate'
import { setActiveCandidate } from '@/features/candidates/slicing'
import {
  setCurrentTab,
  setWelcomeBackCandidate,
} from '@/features/ui/uiSlice'

const { Paragraph } = Typography

export function WelcomeBackModal() {
  const dispatch = useAppDispatch()
  const candidateId = useAppSelector((state) => state.ui.welcomeBackCandidateId)
  const candidate = useAppSelector((state) =>
    candidateId ? selectCandidateById(candidateId)(state) : undefined,
  )

  const closeModal = useCallback(() => {
    dispatch(setWelcomeBackCandidate(undefined))
  }, [dispatch])

  const handleResume = useCallback(() => {
    if (!candidate) return
    dispatch(setActiveCandidate(candidate.id))
    dispatch(setCurrentTab('interviewee'))
    dispatch(resumeInterview())
    closeModal()
  }, [candidate, closeModal, dispatch])

  const handleStartFresh = useCallback(() => {
    closeModal()
    dispatch(setCurrentTab('interviewee'))
    dispatch(setActiveCandidate(undefined))
  }, [closeModal, dispatch])

  return (
    <Modal
      title="Welcome back"
      open={Boolean(candidate)}
      onOk={handleResume}
      onCancel={handleStartFresh}
      okText="Resume interview"
      cancelText="Start fresh"
      centered
    >
      <Paragraph>
        {candidate?.profile.name
          ? `Hi ${candidate.profile.name},`
          : 'Hi User,'}
      </Paragraph>
      <Paragraph>
       Do you want to keep going from where you stopped or begin a new interview?
      </Paragraph>
    </Modal>
  )
}

export default WelcomeBackModal
