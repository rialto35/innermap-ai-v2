/**
 * InnerMap AI v2 - DBML Generator from CSV
 * CSV exports를 읽어서 DBML ERD 파일을 자동 생성
 */

const fs = require('fs');
const path = require('path');

const base = 'docs/db/exports';

// CSV 파일 읽기 함수
function readCSV(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8').trim();
    return content.split('\n').slice(1).map(line => {
      // CSV 파싱 (쉼표로 분리, 따옴표 처리)
      const result = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim().replace(/^"|"$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim().replace(/^"|"$/g, ''));
      return result;
    });
  } catch (error) {
    console.warn(`Warning: Could not read ${filePath}:`, error.message);
    return [];
  }
}

// 파일 존재 확인
const requiredFiles = [
  '01_tables.csv',
  '02_columns.csv', 
  '03_keys.csv',
  '04_foreign_keys.csv'
];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(base, file))) {
    console.error(`Required file not found: ${file}`);
    console.log('Please run the database inventory script first:');
    console.log('psql "$DATABASE_URL" -f scripts/db_inventory.sql');
    process.exit(1);
  }
}

// 데이터 로드
const tCSV = readCSV(path.join(base, '01_tables.csv'));
const cCSV = readCSV(path.join(base, '02_columns.csv'));
const kCSV = readCSV(path.join(base, '03_keys.csv'));
const fCSV = readCSV(path.join(base, '04_foreign_keys.csv'));

console.log(`Loaded ${tCSV.length} tables, ${cCSV.length} columns, ${kCSV.length} keys, ${fCSV.length} foreign keys`);

// 테이블 메타데이터 구성
const tables = {};

// 테이블 초기화
tCSV.forEach(([schema, tableName]) => {
  if (schema === 'public') {
    tables[tableName] = {
      columns: [],
      pk: new Set(),
      unique: new Set(),
      fks: [],
      indexes: new Set()
    };
  }
});

// 컬럼 정보 추가
cCSV.forEach(([tableName, pos, colName, dataType, nullable, defaultValue]) => {
  if (tables[tableName]) {
    tables[tableName].columns.push({
      pos: Number(pos),
      name: colName,
      type: dataType,
      nullable: nullable === 'YES',
      default: defaultValue
    });
  }
});

// 키 정보 추가
kCSV.forEach(([tableName, constraintType, columnName, constraintName]) => {
  if (tables[tableName]) {
    if (constraintType === 'PRIMARY KEY') {
      tables[tableName].pk.add(columnName);
    } else if (constraintType === 'UNIQUE') {
      tables[tableName].unique.add(columnName);
    }
  }
});

// 외래키 정보 추가
fCSV.forEach(([childTable, childCol, parentTable, parentCol, constraintName]) => {
  if (tables[childTable]) {
    tables[childTable].fks.push({
      childCol,
      parentTable,
      parentCol,
      constraintName
    });
  }
});

// DBML 생성
let dbml = `Project "InnerMap AI v2" {
  database_type: "PostgreSQL"
  Note: "Auto-generated from database inventory"
}

`;

// 테이블 정의
Object.entries(tables).forEach(([tableName, meta]) => {
  dbml += `Table ${tableName} {\n`;
  
  // 컬럼 정렬 및 출력
  meta.columns
    .sort((a, b) => a.pos - b.pos)
    .forEach(col => {
      const pk = meta.pk.has(col.name) ? ' [pk]' : '';
      const uq = meta.unique.has(col.name) && !meta.pk.has(col.name) ? ' [unique]' : '';
      const notNull = !col.nullable ? ' [not null]' : '';
      const defaultVal = col.default ? ` [default: ${col.default}]` : '';
      
      dbml += `  ${col.name} ${col.type}${pk}${uq}${notNull}${defaultVal}\n`;
    });
  
  dbml += `}\n\n`;
});

// 관계 정의
Object.entries(tables).forEach(([tableName, meta]) => {
  meta.fks.forEach(fk => {
    dbml += `Ref: ${tableName}.${fk.childCol} > ${fk.parentTable}.${fk.parentCol}\n`;
  });
});

// 출력 디렉토리 생성
const outputDir = 'docs/erd';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// DBML 파일 저장
const outputPath = path.join(outputDir, 'innermap_v2_auto.dbml');
fs.writeFileSync(outputPath, dbml, 'utf8');

console.log(`✅ Generated DBML: ${outputPath}`);
console.log(`📊 Summary:`);
console.log(`   - Tables: ${Object.keys(tables).length}`);
console.log(`   - Total columns: ${Object.values(tables).reduce((sum, t) => sum + t.columns.length, 0)}`);
console.log(`   - Foreign keys: ${Object.values(tables).reduce((sum, t) => sum + t.fks.length, 0)}`);

// 간단한 통계 출력
console.log(`\n📋 Table Summary:`);
Object.entries(tables).forEach(([name, meta]) => {
  console.log(`   - ${name}: ${meta.columns.length} columns, ${meta.fks.length} FKs`);
});

