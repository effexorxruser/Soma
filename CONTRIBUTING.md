# CONTRIBUTING

Спасибо за интерес к Soma.

## Перед началом

1. Прочитайте `README.md` и документы из `docs/`.
2. Проверьте, что изменение не расширяет scope без обсуждения.
3. Убедитесь, что сохраняется policy-first контракт.

## Локальный запуск

```bash
npm install
cp .env.example .env
npm run dev
```

## Обязательные проверки

```bash
npm run lint
npm run test
npm run build
```

## Правила изменений

- Делайте небольшие фокусные PR.
- Не добавляйте в docs/user-facing слой возможности, которых нет в коде.
- Не добавляйте clinical/medical framing.
- Для classifier/policy изменений обновляйте `tests/services/safety/policy.test.ts`.

## Checklist для PR

- [ ] Изменение описано коротко и предметно.
- [ ] Обновлена документация (если затронуто поведение/границы).
- [ ] Пройдены lint/test/build.
- [ ] Сохранены safety-first и policy-first инварианты.
