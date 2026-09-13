PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;

INSERT OR IGNORE INTO usuarios
  (id, nome, email, senha, idade, ocupacao, bio, data_cadastro)
VALUES
  (1, 'Maria Silva', 'maria@example.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 24, 'Estudante', 'Aprendendo a cuidar da rotina com leveza.', '2026-09-01 08:30:00'),
  (2, 'João Oliveira', 'joao@example.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 31, 'Designer', 'Pequenos passos também contam.', '2026-09-02 09:15:00');

INSERT OR IGNORE INTO sugestoes (humor_tipo, titulo, descricao, icone) VALUES
  ('feliz', 'Continue assim!', 'Que bom que você está bem. Aproveite o dia para fazer algo de que gosta.', '😊'),
  ('feliz', 'Compartilhe sua alegria', 'Ligue para alguém querido e espalhe essa energia boa.', '📞'),
  ('triste', 'Tomar um chá quente', 'Um chá de camomila ou cidreira pode trazer conforto para este momento.', '🍵'),
  ('triste', 'Ouvir música relaxante', 'Escolha uma playlist suave e permita-se desacelerar.', '🎵'),
  ('ansioso', 'Meditar por cinco minutos', 'Feche os olhos, respire fundo e observe sua respiração.', '🧘'),
  ('ansioso', 'Praticar respiração 4-7-8', 'Inspire por 4 segundos, segure por 7 e expire por 8. Repita três vezes.', '🌬️'),
  ('cansado', 'Fazer uma pausa', 'Respire ar fresco por alguns minutos ou faça uma caminhada curta.', '🚶'),
  ('cansado', 'Alongar o corpo', 'Faça alongamentos simples para relaxar os músculos.', '🤸'),
  ('irritado', 'Escrever seus sentimentos', 'Anote o que está sentindo para organizar os pensamentos.', '📝'),
  ('irritado', 'Tomar um banho relaxante', 'Um banho morno pode ajudar a acalmar a mente e o corpo.', '🚿'),
  ('neutro', 'Planejar o restante do dia', 'Organize as próximas atividades em passos pequenos e possíveis.', '📋'),
  ('neutro', 'Beber água', 'Manter-se hidratado ajuda no funcionamento do corpo.', '💧');

INSERT INTO sugestoes (humor_tipo, titulo, descricao, icone) VALUES
  ('feliz', 'Guardar um momento bom', 'Anote uma coisa simples que fez seu dia melhor para lembrar depois.', '🌱'),
  ('feliz', 'Fazer algo que dá prazer', 'Reserve alguns minutos para uma atividade que você gosta.', '🎨'),
  ('triste', 'Mandar uma mensagem simples', 'Escreva para alguém de confiança apenas dizendo como você está.', '💬'),
  ('triste', 'Escolher um cuidado possível', 'Escolha uma coisa pequena e gentil para fazer por você agora.', '🫖'),
  ('ansioso', 'Reduzir os estímulos por alguns minutos', 'Se puder, escolha um lugar mais silencioso ou com uma luz mais confortável.', '🎧'),
  ('ansioso', 'Escolher um ponto de conforto', 'Ajuste uma coisa ao seu redor que possa deixar este momento mais suportável.', '🪟'),
  ('ansioso', 'Usar um apoio sensorial conhecido', 'Se você já sabe que algo ajuda, experimente esse recurso no seu ritmo.', '🧸'),
  ('ansioso', 'Dividir o próximo passo', 'Escolha apenas uma ação pequena para fazer agora. O restante pode esperar.', '🪜'),
  ('cansado', 'Escolher uma tarefa essencial', 'Defina só uma prioridade possível e deixe o restante para depois.', '✅'),
  ('cansado', 'Descansar sem culpa', 'Faça uma pausa real, mesmo que sejam apenas alguns minutos.', '🛋️'),
  ('irritado', 'Afastar-se do estímulo', 'Se puder, mude de ambiente por alguns minutos antes de decidir o que fazer.', '🚪'),
  ('irritado', 'Escrever o que precisa mudar', 'Coloque no papel o que incomodou e escolha apenas o próximo passo.', '✍️'),
  ('neutro', 'Escolher uma prioridade pequena', 'Selecione uma tarefa curta para dar direção ao restante do dia.', '🧭'),
  ('neutro', 'Observar como seu corpo está', 'Perceba sua respiração, tensão e energia sem precisar mudar nada agora.', '👀');

INSERT INTO humor (usuario_id, emoji, data_registro) VALUES
  (1, 'feliz', '2026-09-13'),
  (1, 'neutro', '2026-09-12'),
  (1, 'ansioso', '2026-09-11'),
  (2, 'cansado', '2026-09-13'),
  (2, 'triste', '2026-09-12');

INSERT INTO sono (usuario_id, horas_sono, qualidade, data_registro) VALUES
  (1, 7.5, 4, '2026-09-13'),
  (1, 6.0, 3, '2026-09-12'),
  (1, 8.0, 5, '2026-09-11'),
  (2, 6.5, 3, '2026-09-13'),
  (2, 7.0, 4, '2026-09-12');

INSERT INTO energia (usuario_id, nivel_energia, data_registro) VALUES
  (1, 8, '2026-09-13'),
  (1, 6, '2026-09-12'),
  (1, 5, '2026-09-11'),
  (2, 5, '2026-09-13'),
  (2, 7, '2026-09-12');

INSERT INTO lembretes (usuario_id, titulo, icone, horario, concluido, objeto_deixado, hora_deixado, data_criacao) VALUES
  (1, 'Tomar água', '💧', '09:00', 0, NULL, NULL, '2026-09-13 09:00:00'),
  (1, 'Tomar medicamento', '💊', '20:00', 0, NULL, NULL, '2026-09-13 09:05:00'),
  (1, 'Peguei a chave de casa', '🔑', '07:30', 1, 'Chave de casa', '07:30', '2026-09-13 07:30:00'),
  (2, 'Pausa para respirar', '🌬️', '15:00', 0, NULL, NULL, '2026-09-13 08:00:00');

INSERT INTO tarefas (usuario_id, titulo, descricao, icone, concluido, data_criacao, data_conclusao) VALUES
  (1, 'Estudar Node.js', 'Revisar middleware e rotas.', '📚', 0, '2026-09-13 08:00:00', NULL),
  (1, 'Organizar a mesa', 'Guardar materiais que não estão sendo usados.', '🧹', 1, '2026-09-13 08:10:00', '2026-09-13 10:20:00'),
  (2, 'Planejar a semana', 'Escolher três prioridades possíveis.', '🗓️', 0, '2026-09-13 08:30:00', NULL);

INSERT INTO metas (usuario_id, titulo, descricao, icone, data_inicio, data_fim, progresso, status, data_criacao) VALUES
  (1, 'Aprender TypeScript', 'Estudar tipos, interfaces e generics.', '🎯', '2026-09-01', '2026-12-31', 25, 'em_andamento', '2026-09-01 08:40:00'),
  (1, 'Criar rotina de sono', 'Manter horário de sono regular por um mês.', '🌙', '2026-09-10', '2026-10-10', 10, 'em_andamento', '2026-09-10 07:30:00'),
  (2, 'Fazer pausas durante o trabalho', 'Fazer ao menos três pausas conscientes por dia.', '⏳', '2026-09-01', '2026-09-30', 40, 'em_andamento', '2026-09-01 09:20:00');

COMMIT;
