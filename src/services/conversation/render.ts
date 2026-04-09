export function renderStructuredReply(inputText: string): string {
  const compactText = compact(inputText);
  const focus = compactText.length > 0 ? compactText : 'ваш текущий запрос';

  return [
    `Фокус: ${focus}.`,
    'Следующий шаг: выберите одно маленькое действие на ближайшие 10 минут и напишите его в одном предложении.',
  ].join('\n');
}

function compact(value: string): string {
  const normalized = value.replace(/\s+/g, ' ').trim();

  if (normalized.length === 0) {
    return '';
  }

  return normalized.slice(0, 140);
}
