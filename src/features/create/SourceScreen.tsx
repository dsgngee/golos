import { useState } from 'react';
import { useNav } from '../../app/navigation';
import { t } from '../../content/ru';
import { sampleLink, samplePdfs } from '../../data/samples';
import { FORMS, countLabel } from '../../i18n/format';
import { Button } from '../../ui/Button';
import { Icon, type IconName } from '../../ui/icons';
import { Sheet } from '../../ui/Sheet';
import { TextField } from '../../ui/TextField';
import { emptyDraft, useDraft } from './draft';
import styles from './create.module.css';

function Option({ icon, title, sub, onClick }: { icon: IconName; title: string; sub: string; onClick(): void }) {
  return (
    <button className={styles.option} onClick={onClick}>
      <span className={styles.optionIcon}>
        <Icon name={icon} size={24} />
      </span>
      <span className={styles.optionText}>
        <span className={styles.optionTitle}>{title}</span>
        <span className={styles.optionSub}>{sub}</span>
      </span>
      <Icon name="chevronRight" size={18} />
    </button>
  );
}

export function SourceScreen() {
  const [sheet, setSheet] = useState<'pdf' | 'link' | null>(null);
  const [url, setUrl] = useState(sampleLink.url);
  const { setDraft } = useDraft.getState();
  const push = () => useNav.getState().push({ name: 'create.review' });

  return (
    <div className={styles.page}>
      <h1 className={styles.titleXL}>{t.create.title}</h1>
      <p className={styles.lead}>{t.create.subtitle}</p>
      <div className={styles.options}>
        <Option
          icon="paste"
          title={t.create.paste}
          sub={t.create.pasteSub}
          onClick={() => {
            setDraft({ ...emptyDraft(), source: 'text' });
            push();
          }}
        />
        <Option icon="file" title={t.create.pdf} sub={t.create.pdfSub} onClick={() => setSheet('pdf')} />
        <Option icon="link" title={t.create.link} sub={t.create.linkSub} onClick={() => setSheet('link')} />
      </div>

      <Sheet open={sheet === 'pdf'} onClose={() => setSheet(null)} title={t.create.pdfSheet}>
        <div className={styles.files}>
          {samplePdfs.map((f) => (
            <button
              key={f.fileName}
              className={styles.file}
              onClick={() => {
                setDraft({ ...emptyDraft(), source: 'pdf', type: f.type, text: f.text, simulatedWords: f.simulatedWords, chapters: f.chapters, title: f.title });
                setSheet(null);
                push();
              }}
            >
              <Icon name="file" size={22} />
              <span className={styles.fileName}>{f.fileName}</span>
              <span className={styles.fileMeta}>{countLabel(f.simulatedWords, FORMS.word)}</span>
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet open={sheet === 'link'} onClose={() => setSheet(null)} title={t.create.link}>
        <div className={styles.sheetStack}>
          <TextField label={t.create.linkField} type="url" value={url} onChange={setUrl} />
          <Button
            disabled={!url.trim()}
            onClick={() => {
              setDraft({ ...emptyDraft(), source: 'link', type: 'article', text: sampleLink.text, simulatedWords: sampleLink.simulatedWords, title: sampleLink.title });
              setSheet(null);
              push();
            }}
          >
            {t.create.extract}
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
