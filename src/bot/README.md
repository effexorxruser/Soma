# bot layer

В `telegram/` расположен минимальный transport baseline:
- polling adapter;
- runtime-обработчик текстовых сообщений;
- allowlist gate;
- делегирование policy-решений в `src/services/safety/`.

Transport-слой не должен принимать содержательные policy-решения.
