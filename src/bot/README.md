# bot layer

В `telegram/` расположен минимальный transport baseline:
- receive text update;
- allowlist gate;
- normalize input context;
- вызов policy-first contract;
- отправка response payload.

Transport-слой не принимает содержательные policy-решения.
