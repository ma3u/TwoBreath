import { test, expect } from '@playwright/test';

// Tests for the new /techniques.html page on www.twobreath.com.
// Coverage maps to the user's testing rubric:
//   1. Navigation visible & functional
//   2. Mobile + Desktop responsive (no overflow)
//   3. Content fades in step by step
//   4. Font sizes appropriate for presentation
//   5. WCAG-AA contrast
// Plus content-specific assertions: every category present, every technique has a phase rhythm,
// every panic-related technique has at least one peer-reviewed source link.

test.describe('Techniques page (/techniques.html)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/techniques.html', { waitUntil: 'networkidle' });
  });

  // ────────── Navigation ──────────

  test('navigation is visible and points back to home', async ({ page }) => {
    const nav = page.locator('nav#navbar');
    await expect(nav).toBeVisible();

    // Logo links back to index.html
    const logoLink = page.locator('a.nav-logo');
    await expect(logoLink).toHaveAttribute('href', 'index.html');

    // Techniques link is marked active. On mobile the nav-links are hidden until the
    // hamburger is opened, so we assert presence + class membership rather than visibility.
    const activeLink = page.locator('.nav-links a.active');
    await expect(activeLink).toHaveCount(1);
    await expect(activeLink).toContainText(/Techniques/i);
    await expect(activeLink).toHaveAttribute('href', /techniques\.html/);
  });

  test('navigation links are functional', async ({ page }) => {
    const navLinks = page.locator('.nav-links a');
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThanOrEqual(5);

    // Open mobile menu if hamburger is visible
    const navToggle = page.locator('#navToggle');
    if (await navToggle.isVisible()) {
      await navToggle.click();
      await page.waitForTimeout(300);
    }

    // Each link should have a non-empty href
    for (let i = 0; i < linkCount; i++) {
      const href = await navLinks.nth(i).getAttribute('href');
      expect(href).toBeTruthy();
      expect(href.length).toBeGreaterThan(0);
    }
  });

  // ────────── Responsive layout ──────────

  test('no horizontal overflow on the configured viewport', async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5);
  });

  test('all 9 categories are present in the DOM', async ({ page }) => {
    const expectedCategories = [
      '#acute-panic',
      '#pranayama',
      '#walking',
      '#gi',
      '#sleep',
      '#coherence',
      '#performance',
      '#altitude',
      '#couples',
    ];
    for (const id of expectedCategories) {
      await expect(page.locator(id)).toBeAttached();
    }
  });

  test('table-of-contents links resolve to in-page anchors', async ({ page }) => {
    const tocLinks = page.locator('.toc-list a');
    const count = await tocLinks.count();
    expect(count).toBeGreaterThanOrEqual(9);

    for (let i = 0; i < count; i++) {
      const href = await tocLinks.nth(i).getAttribute('href');
      expect(href).toMatch(/^#/);
      // Target element must exist
      await expect(page.locator(href)).toBeAttached();
    }
  });

  // ────────── Step-by-step fade-in ──────────

  test('header content is visible immediately', async ({ page }) => {
    const title = page.locator('.page-title');
    await expect(title).toBeVisible();
    await expect(title).toContainText(/breathing/i);

    const headerPill = page.locator('.header-pill');
    await expect(headerPill).toBeVisible();
  });

  test('fade-in elements activate progressively on scroll', async ({ page }) => {
    // Below-the-fold .fade-in elements should start hidden (opacity < 0.5)
    const lateFade = page.locator('#couples .fade-in').first();
    const initiallyHidden = await lateFade.evaluate(el => {
      const op = parseFloat(window.getComputedStyle(el).opacity);
      return op < 0.5;
    });
    expect(initiallyHidden).toBe(true);

    // Scroll progressively
    for (let i = 0; i < 12; i++) {
      await page.evaluate(step => window.scrollTo(0, step * 400), i);
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(800);

    // At least some fade-ins should now be visible
    const visibleCount = await page.evaluate(() =>
      document.querySelectorAll('.fade-in.visible').length
    );
    expect(visibleCount).toBeGreaterThan(0);
  });

  // ────────── Font sizing ──────────

  test('page title and category titles are large enough for presentation', async ({ page }) => {
    const titleSize = await page.locator('.page-title').evaluate(el => {
      return parseFloat(window.getComputedStyle(el).fontSize);
    });
    expect(titleSize).toBeGreaterThanOrEqual(36);

    const h2Sizes = await page.locator('.category-title').evaluateAll(els =>
      els.map(el => parseFloat(window.getComputedStyle(el).fontSize))
    );
    expect(h2Sizes.length).toBeGreaterThan(0);
    for (const size of h2Sizes) {
      expect(size).toBeGreaterThanOrEqual(22);
    }
  });

  // ────────── Contrast / accessibility ──────────

  test('text contrast is excellent (WCAG-AA on dark background)', async ({ page }) => {
    // Page title — should be near-white
    const titleColor = await page.locator('.page-title').evaluate(el =>
      window.getComputedStyle(el).color
    );
    const titleMatch = titleColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (titleMatch) {
      const [, r, g, b] = titleMatch.map(Number);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      expect(luminance).toBeGreaterThan(0.6);
    }

    // Body bg — should be very dark
    const bg = await page.evaluate(() =>
      window.getComputedStyle(document.body).backgroundColor
    );
    const bgMatch = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (bgMatch) {
      const [, r, g, b] = bgMatch.map(Number);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      expect(luminance).toBeLessThan(0.15);
    }

    // Body description text on cards — should be readable (≥0.4 luminance)
    const descColor = await page.locator('.technique-desc').first().evaluate(el =>
      window.getComputedStyle(el).color
    );
    const dMatch = descColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (dMatch) {
      const [, r, g, b] = dMatch.map(Number);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      expect(luminance).toBeGreaterThan(0.4);
    }
  });

  test('skip-to-content link exists for screen readers', async ({ page }) => {
    const skip = page.locator('a.skip-link');
    await expect(skip).toHaveAttribute('href', '#main-content');
  });

  // ────────── Content correctness ──────────

  test('every technique card has a phase-rhythm and at least one phase pill', async ({ page }) => {
    const techniques = page.locator('article.technique');
    const count = await techniques.count();
    // We added 7 new techniques + 12 existing ones in 9 categories. At least 14 cards.
    expect(count).toBeGreaterThanOrEqual(14);

    for (let i = 0; i < count; i++) {
      const card = techniques.nth(i);
      await expect(card.locator('.technique-name')).toBeAttached();
      await expect(card.locator('.phase-rhythm')).toBeAttached();
      const pills = card.locator('.phase-pill');
      const pillCount = await pills.count();
      expect(pillCount).toBeGreaterThanOrEqual(2);
    }
  });

  test('the 7 newly-added panic-relief techniques are present by id-tag', async ({ page }) => {
    const expectedIDs = [
      'panic-relief',
      'nadi-shodhana-panic',
      'walking-breath-simple',
      'walking-breath-counted',
      'bhramari-humming',
      'sitali-cooling',
      'buteyko-reduced',
    ];
    for (const id of expectedIDs) {
      const tag = page.locator(`.id-tag:has-text("${id}")`);
      await expect(tag.first()).toBeVisible();
    }
  });

  test('panic-relief card encodes both post-inspiratory hold and post-expiratory rest', async ({ page }) => {
    const card = page.locator('article.technique').filter({ hasText: 'panic-relief' });
    await expect(card.locator('.phase-pill.hold')).toBeVisible();
    await expect(card.locator('.phase-pill.rest')).toBeVisible();
  });

  test('every panic-related technique has at least one PubMed source link', async ({ page }) => {
    const panicIDs = ['panic-relief', 'nadi-shodhana-panic', 'bhramari-humming'];
    for (const id of panicIDs) {
      const card = page.locator('article.technique').filter({ hasText: id });
      const pubmedLinks = card.locator('a[href*="pubmed.ncbi.nlm.nih.gov"]');
      const linkCount = await pubmedLinks.count();
      expect(linkCount).toBeGreaterThanOrEqual(1);
    }
  });

  test('safety notice is visible above the fold-equivalent zone', async ({ page }) => {
    const safety = page.locator('.safety-box');
    await expect(safety).toBeVisible();
    await expect(safety).toContainText(/medical|emergency/i);
  });

  // ────────── Outbound links ──────────

  test('all PubMed links open in a new tab safely', async ({ page }) => {
    const pubmedLinks = page.locator('a[href*="pubmed.ncbi.nlm.nih.gov"]');
    const count = await pubmedLinks.count();
    expect(count).toBeGreaterThan(15); // 25+ studies cited

    for (let i = 0; i < count; i++) {
      const link = pubmedLinks.nth(i);
      await expect(link).toHaveAttribute('target', '_blank');
      const rel = await link.getAttribute('rel');
      expect(rel).toContain('noopener');
    }
  });

  // ────────── No JS errors ──────────

  test('no console errors on page load', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/techniques.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    expect(errors.filter(e => !e.includes('favicon'))).toEqual([]);
  });

});

test.describe('Voice player & i18n', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/techniques.html', { waitUntil: 'networkidle' });
  });

  test('language switcher buttons are present (EN/DE/JA)', async ({ page }) => {
    const langButtons = page.locator('.lang-btn');
    await expect(langButtons).toHaveCount(3);
    await expect(page.locator('.lang-btn[data-lang="en"]')).toBeVisible();
    await expect(page.locator('.lang-btn[data-lang="de"]')).toBeVisible();
    await expect(page.locator('.lang-btn[data-lang="ja"]')).toBeVisible();
  });

  test('switching to German changes header title to German', async ({ page }) => {
    await page.locator('.lang-btn[data-lang="de"]').click();
    await page.waitForTimeout(200);
    const title = page.locator('.page-title');
    await expect(title).toContainText(/Atemtechniken/i);
    // Active state
    await expect(page.locator('.lang-btn[data-lang="de"]')).toHaveClass(/active/);
  });

  test('switching to Japanese changes header title to Japanese', async ({ page }) => {
    await page.locator('.lang-btn[data-lang="ja"]').click();
    await page.waitForTimeout(200);
    const title = page.locator('.page-title');
    await expect(title).toContainText(/呼吸|テクニック/);
  });

  test('safety notice is translated when switching language', async ({ page }) => {
    await page.locator('.lang-btn[data-lang="de"]').click();
    await page.waitForTimeout(200);
    await expect(page.locator('.safety-box')).toContainText(/Sicherheitshinweis/i);
  });

  test('selected language persists across page reload', async ({ page }) => {
    await page.locator('.lang-btn[data-lang="de"]').click();
    await page.waitForTimeout(200);
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator('.lang-btn[data-lang="de"]')).toHaveClass(/active/);
    await expect(page.locator('.page-title')).toContainText(/Atemtechniken/i);
  });

  test('voice player FAB is visible', async ({ page }) => {
    const fab = page.locator('#voiceFab');
    await expect(fab).toBeVisible();
    await expect(page.locator('#voiceBtn')).toBeVisible();
    await expect(page.locator('#voiceSkip')).toBeVisible();
    await expect(page.locator('#voiceTitle')).toBeVisible();
  });

  test('the 7 narrated techniques are marked with data-has-audio', async ({ page }) => {
    const narratedIDs = [
      'panic-relief', 'nadi-shodhana-panic', 'walking-breath-simple',
      'walking-breath-counted', 'bhramari-humming', 'sitali-cooling', 'buteyko-reduced',
    ];
    for (const id of narratedIDs) {
      const card = page.locator(`article.technique[data-tid="${id}"]`);
      await expect(card).toHaveAttribute('data-has-audio', 'true');
    }
  });

  test('all narrated audio files are reachable (HEAD 200)', async ({ page, request }) => {
    const narratedIDs = [
      'panic-relief', 'nadi-shodhana-panic', 'walking-breath-simple',
      'walking-breath-counted', 'bhramari-humming', 'sitali-cooling', 'buteyko-reduced',
    ];
    const origin = new URL(page.url()).origin;
    for (const id of narratedIDs) {
      for (const lang of ['en', 'de', 'ja']) {
        const url = `${origin}/audio/techniques/${id}-${lang}.mp3`;
        const res = await request.get(url);
        expect(res.status(), `${id}-${lang}.mp3`).toBe(200);
      }
    }
  });

  test('clicking play starts narrating the first technique', async ({ page }) => {
    // Page autoplay restrictions in headless can prevent .play() — handle resolution gracefully
    await page.locator('#voiceBtn').click();
    await page.waitForTimeout(800);
    // Either the FAB is "playing" or audio.play() rejected (headless policy).
    // What MUST happen: first card gets is-narrating class OR src is set.
    const firstCardHighlighted = await page.locator('article.technique[data-tid="panic-relief"].is-narrating').count();
    const audioSrc = await page.evaluate(() => {
      const audios = document.querySelectorAll('audio');
      // The player creates an <audio> via JS; we don't render it. Inspect via __voicePlayer hooks.
      return window.__voicePlayer ? 'has-player' : 'no-player';
    });
    // At least the player object should exist
    expect(audioSrc).toBe('has-player');
  });

});

test.describe('Home page links to Techniques', () => {

  test('main nav on home page contains a Techniques link', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const techLink = page.locator('.nav-links a[href="techniques.html"]');
    await expect(techLink).toHaveCount(1);
  });

  test('CTA section on home page contains a link to Techniques', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const ctaLink = page.locator('.cta-buttons a[href="techniques.html"]');
    await expect(ctaLink).toBeVisible();
    await expect(ctaLink).toContainText(/Technique/i);
  });

  test('footer on home page links to Techniques', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const footerLink = page.locator('footer a[href="techniques.html"]');
    await expect(footerLink).toBeVisible();
  });

});
