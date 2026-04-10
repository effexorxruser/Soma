export function renderStructuredReply(inputText: string): string {
  const compactText = compact(inputText);
  const profile = detectConversationProfile(compactText);

  if (profile === 'anxiety') {
    return joinLines([
      'Похоже, сейчас есть тревога и внутреннее напряжение.',
      'Давайте сузим фокус до ближайших 10 минут.',
      'Маленький шаг: назовите один спокойный бытовой шаг, который можно сделать прямо сейчас.',
    ]);
  }

  if (profile === 'overload') {
    return joinLines([
      'Слышу перегруз: задач и мыслей сейчас может быть слишком много.',
      'Чтобы снизить шум, выберите только один приоритет на сейчас.',
      'Маленький шаг: напишите один пункт, который хотите закрыть первым.',
    ]);
  }

  if (profile === 'confusion') {
    return joinLines([
      'Похоже на путаницу: неясно, с чего начать.',
      'Разделим это на один понятный фокус.',
      'Маленький шаг: сформулируйте одну ближайшую задачу в одном коротком предложении.',
    ]);
  }

  if (profile === 'small_step_request') {
    return joinLines([
      'Ок, давайте без перегруза и только один шаг.',
      'Выберите простое действие, которое займет до 10 минут.',
      'Маленький шаг: напишите этот шаг одной фразой и начните с него.',
    ]);
  }

  if (profile === 'soft_state_review') {
    return joinLines([
      'Можем мягко разобрать состояние без лишних интерпретаций.',
      'Сейчас полезно выделить одну главную мысль или чувство.',
      'Маленький шаг: опишите это одной короткой фразой.',
    ]);
  }

  if (profile === 'greeting_short') {
    return joinLines(['Здравствуйте.', 'Если хотите, можем спокойно продолжить с одного фокуса.']);
  }

  if (profile === 'acknowledgement_short') {
    return joinLines(['Принято.', 'Если нужно, продолжайте в одном коротком сообщении.']);
  }

  if (profile === 'ambiguous_short') {
    return joinLines([
      'Можно уточнить одним коротким предложением, что сейчас важнее всего.',
    ]);
  }

  const focus = compactText.length > 0 ? compactText : 'текущий запрос';

  return joinLines([
    `Вижу ваш контекст: ${focus}.`,
    'Держим один фокус и без лишних деталей.',
    'Маленький шаг: выберите одно простое действие на ближайшие 10 минут и напишите его.',
  ]);
}

function compact(value: string): string {
  const normalized = value.replace(/\s+/g, ' ').trim();

  if (normalized.length === 0) {
    return '';
  }

  return normalized.slice(0, 140);
}

type ConversationProfile =
  | 'anxiety'
  | 'overload'
  | 'confusion'
  | 'soft_state_review'
  | 'small_step_request'
  | 'greeting_short'
  | 'acknowledgement_short'
  | 'ambiguous_short'
  | 'neutral';

const GREETING_SHORT_KEYWORDS = [
  'привет',
  'здравствуй',
  'здравствуйте',
  'добрый день',
  'добрый вечер',
  'доброе утро',
];

const ACKNOWLEDGEMENT_SHORT_KEYWORDS = [
  'ок',
  'окей',
  'понял',
  'поняла',
  'понятно',
  'ясно',
  'хорошо',
  'угу',
  'ага',
  'принято',
];

const AMBIGUOUS_SHORT_KEYWORDS = ['как-то так', 'ну да', 'мм', 'мда', 'хм'];

export function detectConversationProfile(input: string): ConversationProfile {
  const normalized = input.toLowerCase();

  if (!normalized) {
    return 'ambiguous_short';
  }

  if (containsAny(normalized, ['тревог', 'тревожно', 'страшно', 'паник', 'накрывает'])) {
    return 'anxiety';
  }

  if (containsAny(normalized, ['перегруз', 'завал', 'слишком много', 'не вывожу', 'устал'])) {
    return 'overload';
  }

  if (containsAny(normalized, ['не понимаю', 'запутал', 'расфокус', 'не знаю что делать', 'каша в голове'])) {
    return 'confusion';
  }

  if (containsAny(normalized, ['следующий шаг', 'с чего начать', 'что делать дальше', 'первый шаг'])) {
    return 'small_step_request';
  }

  if (containsAny(normalized, ['разобрать состояние', 'помоги разобрать', 'помоги разложить', 'что со мной'])) {
    return 'soft_state_review';
  }

  const isShortInput = normalized.length <= 18 && normalized.split(' ').length <= 3;

  if (isShortInput && matchesShortPhrase(normalized, GREETING_SHORT_KEYWORDS)) {
    return 'greeting_short';
  }

  if (isShortInput && matchesShortPhrase(normalized, ACKNOWLEDGEMENT_SHORT_KEYWORDS)) {
    return 'acknowledgement_short';
  }

  if (isShortInput && matchesShortPhrase(normalized, AMBIGUOUS_SHORT_KEYWORDS)) {
    return 'ambiguous_short';
  }

  if (isShortInput) {
    return 'ambiguous_short';
  }

  return 'neutral';
}

function matchesShortPhrase(input: string, phrases: string[]): boolean {
  return phrases.some((phrase) => input === phrase);
}

function containsAny(input: string, keywords: string[]): boolean {
  return keywords.some((keyword) => input.includes(keyword));
}

function joinLines(lines: string[]): string {
  return lines.join('\n');
}
