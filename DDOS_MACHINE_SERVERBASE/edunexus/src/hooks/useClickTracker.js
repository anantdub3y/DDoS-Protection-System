import { useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const TRACKABLE_SELECTORS = [
  'a', 'button', 'input[type="submit"]', 'input[type="button"]',
  '[role="button"]', '[role="link"]', '[role="menuitem"]',
  '[data-track]', 'nav a', '.service-card', 'form button',
]

function getElementLabel(el) {
  return (
    el.getAttribute('data-track') ||
    el.getAttribute('aria-label') ||
    el.textContent?.trim().slice(0, 60) ||
    el.getAttribute('href') ||
    el.tagName.toLowerCase()
  )
}

function isTrackable(el) {
  return TRACKABLE_SELECTORS.some(sel => {
    try { return el.matches?.(sel) || el.closest?.(sel) }
    catch { return false }
  })
}

export default function useClickTracker(pageName = 'unknown') {

  // ── NEW: log visitor IP on every page load ──────────────────
  useEffect(() => {
    fetch('/api/visit').catch(() => {})   // silent — never break UI
  }, [])
  // ────────────────────────────────────────────────────────────

  const track = useCallback(async (element) => {
    try {
      await supabase.from('click_events').insert({
        page:       pageName,
        element:    element,
        event_type: 'click',
        from_ip:    null,
        meta:       JSON.stringify({ url: window.location.pathname }),
      })
    } catch (_) {}
  }, [pageName])

  useEffect(() => {
    function handleClick(e) {
      let target = e.target
      for (let i = 0; i < 5; i++) {
        if (!target) break
        if (isTrackable(target)) {
          track(getElementLabel(target))
          return
        }
        target = target.parentElement
      }
      track(e.target?.tagName?.toLowerCase() || 'unknown')
    }
    document.addEventListener('click', handleClick, { passive: true })
    return () => document.removeEventListener('click', handleClick)
  }, [track])
}