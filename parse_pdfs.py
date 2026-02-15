import pdfplumber, os, glob, json, re

pdf_dir = r'd:\countrycollege\school-demo\pdf files'
files = sorted(glob.glob(os.path.join(pdf_dir, '*.pdf')))

all_data = {}

for f in files:
    basename = os.path.basename(f).replace('.pdf','')
    m = re.match(r'(\d+TH\s+\w+)\s+ROUND\s+(\d+)', basename, re.I)
    if not m:
        continue
    cls_name = m.group(1).strip().title()
    round_num = int(m.group(2))
    
    students = []
    try:
        with pdfplumber.open(f) as pdf:
            for page in pdf.pages:
                tables = page.extract_tables()
                if tables:
                    for table in tables:
                        for row in table:
                            cells = [str(c or '').strip() for c in row]
                            if cells[0] and cells[0].isdigit():
                                try:
                                    name = cells[2].strip()
                                    pct = float(cells[3])
                                    position = int(cells[4]) if cells[4].isdigit() else 0
                                    presents = int(cells[5]) if cells[5].isdigit() else 0
                                    absents = int(cells[6]) if cells[6].isdigit() else 0
                                    students.append({
                                        'name': name.title(),
                                        'pct': pct,
                                        'position': position,
                                        'presents': presents,
                                        'absents': absents,
                                    })
                                except (ValueError, IndexError):
                                    pass
    except Exception as e:
        print(f'ERROR: {basename}: {e}')
    
    key = f'{cls_name}|R{round_num}'
    if key in all_data:
        if len(students) > len(all_data[key]):
            all_data[key] = students
    else:
        all_data[key] = students
    print(f'{basename}: {len(students)} students parsed')

# Build per-class, per-student data
classes = {}
for key, students in sorted(all_data.items()):
    cls, rnd = key.split('|')
    if cls not in classes:
        classes[cls] = {}
    for s in students:
        name = s['name']
        if name not in classes[cls]:
            classes[cls][name] = {'rounds': {}, 'attendance': {}}
        classes[cls][name]['rounds'][rnd] = s['pct']
        total = s['presents'] + s['absents']
        att_pct = round(s['presents'] / total * 100, 1) if total > 0 else 0
        classes[cls][name]['attendance'][rnd] = att_pct

# Summary
for cls in sorted(classes.keys()):
    print(f'\n{cls}: {len(classes[cls])} unique students')
    for name, data in sorted(classes[cls].items(), key=lambda x: -max(x[1]["rounds"].values())):
        rounds_str = ', '.join([f'{r}:{v}%' for r,v in sorted(data['rounds'].items())])
        print(f'  {name}: {rounds_str}')

# Class averages per round
class_avgs = {}
for cls in sorted(classes.keys()):
    class_avgs[cls] = {}
    round_keys = set()
    for name, data in classes[cls].items():
        round_keys.update(data['rounds'].keys())
    for rnd in sorted(round_keys):
        scores = [data['rounds'][rnd] for name, data in classes[cls].items() if rnd in data['rounds']]
        class_avgs[cls][rnd] = round(sum(scores) / len(scores), 2) if scores else 0

print('\nClass Averages:')
for cls, avgs in class_avgs.items():
    print(f'  {cls}: {avgs}')

# Save
output = {
    'classes': classes,
    'class_averages': class_avgs
}
with open(r'd:\countrycollege\school-demo\parsed_data.json', 'w') as f:
    json.dump(output, f, indent=2)
print('\nSaved to parsed_data.json')
