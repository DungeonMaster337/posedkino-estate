/**
 * Заявки с лендинга «Поседкино» → Google Таблица.
 * Каждая заявка добавляется новой строкой. Доступ к таблице раздаётся кому нужно.
 *
 * ── КАК ПОДКЛЮЧИТЬ (5 минут) ──────────────────────────────────────────────
 * 1. Создай Google Таблицу (sheets.new). Переименуй первый лист в «Заявки».
 *    В первую строку впиши заголовки (по желанию, скрипт и так пишет данные):
 *    Дата | Имя | Телефон | Telegram/WhatsApp | E-mail | Интерес | Комментарий | Страница
 * 2. В таблице: Расширения → Apps Script.
 * 3. Удали пример кода, вставь ВЕСЬ код из этого файла. Сохрани (Ctrl+S).
 * 4. Нажми «Развернуть» (Deploy) → «Новое развёртывание» → тип «Веб-приложение».
 *    - Описание: любое.
 *    - Запуск от имени: «Я».
 *    - У кого есть доступ: «Все» (Anyone).  ← ВАЖНО, иначе форма не сможет писать.
 *    Нажми «Развернуть», разреши доступ (Google спросит подтверждение).
 * 5. Скопируй выданный URL веб-приложения (вида https://script.google.com/macros/s/AKfyc.../exec).
 * 6. Вставь этот URL в index.html в строку:  const SHEETS_ENDPOINT = "СЮДА";
 *    Закоммить и запушить (git add index.html && git commit -m "form endpoint" && git push).
 * 7. Готово. Отправь тестовую заявку с сайта — строка появится в таблице.
 *
 * Доступ «для всех кому надо»: в таблице «Настройки доступа» → добавь людей (Просмотр/Редактирование).
 *
 * Если поменяешь код скрипта позже — делай «Развернуть → Управление развёртываниями →
 * редактировать → Новая версия», URL при этом сохранится.
 * ──────────────────────────────────────────────────────────────────────────
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Заявки') || ss.getSheets()[0];

    var d = {};
    try { d = JSON.parse(e.postData.contents); } catch (err) { d = {}; }

    sheet.appendRow([
      new Date(),
      d.name || '',
      d.phone || '',
      d.messenger || '',
      d.email || '',
      d.interest || '',
      d.comment || '',
      d.page || ''
    ]);

    // (необязательно) дублировать заявку на почту — раскомментируй и впиши адрес:
    // MailApp.sendEmail('you@mail.ru', 'Новая заявка с лендинга Поседкино',
    //   'Имя: ' + (d.name||'') + '\nТелефон: ' + (d.phone||'') +
    //   '\nМессенджер: ' + (d.messenger||'') + '\nEmail: ' + (d.email||'') +
    //   '\nИнтерес: ' + (d.interest||'') + '\nКомментарий: ' + (d.comment||''));

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Позволяет открыть URL в браузере и убедиться, что веб-приложение живо.
function doGet() {
  return ContentService.createTextOutput('OK: приёмник заявок работает.');
}
