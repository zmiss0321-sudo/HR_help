const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await page.getByText('实习接力站').first().waitFor();
  console.log('page-open-ok');

  await page.getByRole('button', { name: '匿名投稿' }).click();
  await page.locator('input[placeholder*="2026"]').fill('2026 春招周期');
  const areas = page.locator('textarea');
  await areas.nth(0).fill('测试踩坑内容');
  await areas.nth(1).fill('测试错误原因');
  await areas.nth(2).fill('测试影响');
  await areas.nth(3).fill('测试解决方法');
  await areas.nth(4).fill('测试建议');
  await page.getByRole('button', { name: /提交匿名经验/ }).click();
  await page.getByText(/已匿名进入审核区/).waitFor();
  console.log('submit-ok');

  await page.getByRole('button', { name: '审核看板' }).click();
  await page.getByText(/EXP-2026-/).first().click();
  await page.getByRole('button', { name: /通过并加入经验库/ }).click();
  await page.getByRole('button', { name: '岗位接力包' }).click();
  await page.getByText('匿名前任实习生').first().waitFor();
  console.log('approve-visible-ok');

  const saved = await page.evaluate(() => Boolean(localStorage.getItem('intern-relay-station-data')));
  if (!saved) throw new Error('localStorage data missing');
  console.log('localStorage-ok');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'mobile-check.png', fullPage: true });
  console.log('mobile-ok');
  await browser.close();
})();
