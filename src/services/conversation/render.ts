export function renderStructuredReply(inputText: string): string {
  const compactText = compact(inputText);
  const profile = detectProfile(compactText);

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

  if (profile === 'ambiguous_short') {
    return joinLines([
      'Понял вас.',
      'Если хотите, можно уточнить в одном коротком предложении, что сейчас самое важное.',
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
  | 'ambiguous_short'
  | 'neutral';

function detectProfile(input: string): ConversationProfile {
  const normalized = input.toLowerCase();

  if (!normalized) {
    return 'ambiguous_short';
  }

  if (normalized.length <= 18 && normalized.split(' ').length <= 3) {
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

  return 'neutral';
}

function containsAny(input: string, keywords: string[]): boolean {
  return keywords.some((keyword) => input.includes(keyword));
}

function joinLines(lines: string[]): string {
  return lines.join('\n');
}
