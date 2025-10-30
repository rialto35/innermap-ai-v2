/**
 * 세션 관리 유틸리티
 * "로그인 상태 유지" 기능 지원
 */

/**
 * 로그인 상태 유지 여부 확인
 */
export function isRememberMeEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('remember_me') === '1';
}

/**
 * 로그인 상태 유지 설정
 */
export function setRememberMe(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  
  if (enabled) {
    localStorage.setItem('remember_me', '1');
  } else {
    localStorage.removeItem('remember_me');
  }
}

/**
 * 로그아웃 시 remember 상태 초기화
 */
export function clearRememberMe(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('remember_me');
}

/**
 * 세션 만료 시 처리
 * remember_me가 활성화되어 있으면 자동 재로그인 시도하지 않고
 * 사용자에게 재로그인 요청
 */
export function handleSessionExpired(): void {
  if (typeof window === 'undefined') return;
  
  const remember = isRememberMeEnabled();
  
  if (!remember) {
    // remember_me가 비활성화되어 있으면 로그인 페이지로 즉시 이동
    window.location.href = '/login?expired=1';
  } else {
    // remember_me가 활성화되어 있어도 세션이 만료되면 재로그인 필요
    // (보안상 자동 재로그인은 하지 않음)
    window.location.href = '/login?expired=1&remember=1';
  }
}

