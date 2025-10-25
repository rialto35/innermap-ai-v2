/**
 * Email Queue
 * 이메일 리포트 발송 큐 관리
 */

import { supabaseAdmin } from './supabase';

/**
 * 이메일 발송 작업 큐에 추가
 */
export async function enqueueEmailJob(params: {
  userId: string;
  assessmentId: string;
  template: 'summary' | 'full';
}) {
  const { userId, assessmentId, template } = params;
  
  try {
    const { data, error } = await supabaseAdmin
      .from('email_jobs')
      .insert({
        user_id: userId,
        assessment_id: assessmentId,
        template,
        status: 'queued',
        retry_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ [emailQueue] Failed to enqueue:', error);
      return { ok: false, error };
    }

    console.log('✅ [emailQueue] Job enqueued:', data.id);
    return { ok: true, jobId: data.id };
  } catch (err) {
    console.error('❌ [emailQueue] Exception:', err);
    return { ok: false, error: err };
  }
}

/**
 * 이메일 발송 작업 상태 업데이트
 */
export async function updateEmailJobStatus(
  jobId: string,
  status: 'sent' | 'failed',
  retryCount?: number
) {
  try {
    const { error } = await supabaseAdmin
      .from('email_jobs')
      .update({ 
        status, 
        ...(retryCount !== undefined && { retry_count: retryCount })
      })
      .eq('id', jobId);

    if (error) {
      console.error('❌ [emailQueue] Failed to update status:', error);
      return { ok: false, error };
    }

    return { ok: true };
  } catch (err) {
    console.error('❌ [emailQueue] Exception:', err);
    return { ok: false, error: err };
  }
}

