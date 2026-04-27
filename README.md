# Analisi Ordini e Consegne

Applicazione Next.js per analizzare ordini e consegne da file Excel con raggruppamenti settimanali e mensili.

## 🚀 Funzionalità

- **Caricamento File Excel**: Importa facilmente i dati degli ordini da file `.xlsx` o `.xls`
- **Raggruppamento Settimanale**: Visualizza i dati raggruppati per settimana (da lunedì a domenica)
- **Raggruppamento Mensile**: Analizza i totali mensili con suddivisione settimanale
- **Dettaglio Ordini**: Espandi ogni settimana per vedere il dettaglio di tutti gli ordini
- **Totali Automatici**: Calcolo automatico di:
  - Numero ordini e valore totale ordini (`total_products`)
  - Numero consegne e valore totale consegne (`total_shipping`)

## 📋 Formato File Excel

Il file Excel deve contenere le seguenti colonne:

- `created_at`: Data e ora di creazione dell'ordine
- `reference`: Riferimento ordine
- `customer`: Nome cliente
- `status`: Stato dell'ordine (es. "Confermato", "Consegnato")
- `total_products`: Valore prodotti (Valore Ordini)
- `total_shipping`: Valore spedizione (Valore Consegne)

### Esempio:

| created_at | reference | customer | status | total_products | total_shipping |
|------------|-----------|----------|--------|----------------|----------------|
| 2026-03-22 19:32 | CJK095R | Sofia Baggieri | Confermato | 8.00 | 0.00 |
| 2026-03-21 20:09 | P7LQ0F1 | Mattia Corrado | Consegnato | 18.40 | 10.00 |

## 🛠️ Installazione

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

## 📦 Tecnologie Utilizzate

- **Next.js 15** - Framework React
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **XLSX** - Parsing file Excel
- **date-fns** - Manipolazione date

## 🎯 Come Usare

1. Avvia l'applicazione con `npm run dev`
2. Clicca su "Carica File Excel"
3. Seleziona il tuo file Excel con i dati degli ordini
4. I dati verranno automaticamente raggruppati per mese e settimana
5. Clicca sui mesi per espandere e vedere le settimane
6. Clicca sulle settimane per vedere il dettaglio degli ordini

## 📊 Visualizzazione Dati

L'applicazione mostra:

### Totale Generale
- N° Ordini totali
- Valore Ordini totale (somma di `total_products`)
- N° Consegne totali (ordini con `total_shipping` > 0)
- Valore Consegne totale (somma di `total_shipping`)

### Per ogni Mese
- Totali mensili con numero settimane
- Lista settimane espandibili

### Per ogni Settimana (Lunedì-Domenica)
- Periodo della settimana (es. "16/03 - 22/03")
- Totali settimanali
- Tabella dettagliata con tutti gli ordini

## 🔧 Build per Produzione

```bash
# Build dell'applicazione
npm run build

# Avvia in produzione
npm start
```

## 📝 Note

- Le settimane iniziano di lunedì e finiscono di domenica
- I totali vengono calcolati automaticamente ad ogni livello
- Il valore delle consegne viene evidenziato in arancione
- Gli ordini senza spedizione mostrano "-" nel campo spedizione

## 🤝 Supporto

Per problemi o domande, apri una issue nel repository.
