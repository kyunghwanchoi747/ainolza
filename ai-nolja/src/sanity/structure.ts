import type { StructureResolver } from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('AI놀자 콘텐츠 관리')
    .items([
      // 사이트 설정
      S.listItem()
        .id('siteSettingsListItem')
        .title('사이트 설정')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      // 홈페이지 전용 섹션
      S.listItem()
        .id('homeSectionsListItem')
        .title('홈페이지 섹션')
        .child(
          S.list()
            .title('홈페이지 섹션')
            .items([S.documentTypeListItem('hero').title('Hero 섹션')]),
        ),
      // 핵심 콘텐츠
      S.documentTypeListItem('lecture').title('강의/커리큘럼'),
      S.documentTypeListItem('post').title('인사이트/트렌드'),
      S.documentTypeListItem('product').title('스토어 상품'),
      S.documentTypeListItem('tool').title('도구함 (Prompt 등)'),
      S.divider(),
      // 일반 페이지
      S.documentTypeListItem('page').title('일반 페이지'),
      // 나머지
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !['siteSettings', 'hero', 'lecture', 'post', 'product', 'tool', 'page'].includes(
            listItem.getId() || '',
          ),
      ),
    ])
