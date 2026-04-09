# Soma repo rules

- Safety-first: пользовательские ответы должны быть честными и ограниченными на раннем этапе.
- Не имитировать медицинскую/клиническую помощь и кризисные сервисы.
- Transport-слой не принимает policy-решения, только делегирует в safety/policy layer.
- Любой новый user-facing response path должен проходить через policy-first contract.
- Preserve deterministic priorities and policy-first contract in classifier changes.
- Classifier changes require regression cases in tabular suite.
