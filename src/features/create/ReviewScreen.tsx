import { useNav } from '../../app/navigation';
import { t } from '../../content/ru';
import { samplePasteText } from '../../data/samples';
import { formatEstimate } from '../../i18n/format';
import { Button } from '../../ui/Button';
import { NavBar } from '../../ui/NavBar';
import { PrototypeHint } from '../../ui/PrototypeHint';
import { TextField } from '../../ui/TextField';
import { draftWords, estimateSec, suggestTitle, useDraft } from './draft';
import styles from './create.module.css';

export function ReviewScreen() {
  const draft = useDraft((s) => s.draft);
  const setDraft = useDraft((s) => s.setDraft);
  const blank = !draft.text.trim();
  const words = blank ? 0 : draftWords(draft);

  return (
    <div>
      <NavBar title={t.create.reviewTitle} onBack={() => useNav.getState().pop()} />
      <div className={styles.page}>
        <TextField
          label={t.create.textLabel}
          hideLabel
          multiline
          rows={10}
          value={draft.text}
          placeholder={t.create.textPlaceholder}
          onChange={(text) => setDraft({ text })}
        />
        {draft.source === 'text' && (
          <PrototypeHint onClick={() => setDraft({ text: samplePasteText, simulatedWords: undefined })}>{t.create.example}</PrototypeHint>
        )}
        {blank ? (
          <p className={styles.hint}>{t.create.needText}</p>
        ) : (
          <p className={styles.stats}>{t.create.stats(words, formatEstimate(estimateSec(words)))}</p>
        )}
        {!blank && draft.chapters && (
          <div className={styles.chapters}>
            <p className={styles.label}>{t.create.chaptersFound(draft.chapters.length)}</p>
            <ol className={styles.chapterList}>
              {draft.chapters.map((c) => (
                <li key={c.title}>{c.title}</li>
              ))}
            </ol>
          </div>
        )}
        <Button
          disabled={blank}
          onClick={() => {
            if (!draft.title.trim()) setDraft({ title: suggestTitle(draft.text) });
            useNav.getState().push({ name: 'create.options' });
          }}
        >
          {t.create.next}
        </Button>
      </div>
    </div>
  );
}
