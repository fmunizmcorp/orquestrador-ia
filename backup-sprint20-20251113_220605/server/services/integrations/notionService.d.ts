interface PageProperty {
    [key: string]: any;
}
interface DatabaseQueryFilter {
    property?: string;
    filter?: any;
    sorts?: any[];
}
declare class NotionService {
    private getToken;
    saveToken(userId: number, token: string): Promise<void>;
    private request;
    queryDatabase(userId: number, databaseId: string, options?: DatabaseQueryFilter): Promise<any>;
    createDatabase(userId: number, parentPageId: string, title: string, properties: any): Promise<any>;
    getDatabase(userId: number, databaseId: string): Promise<any>;
    updateDatabase(userId: number, databaseId: string, updates: any): Promise<any>;
    getPage(userId: number, pageId: string): Promise<any>;
    createPage(userId: number, parentId: string, parentType: 'database_id' | 'page_id', properties: PageProperty, content?: any[]): Promise<any>;
    updatePage(userId: number, pageId: string, properties: PageProperty): Promise<any>;
    archivePage(userId: number, pageId: string): Promise<any>;
    getBlockChildren(userId: number, blockId: string, startCursor?: string): Promise<any>;
    appendBlockChildren(userId: number, blockId: string, children: any[]): Promise<any>;
    deleteBlock(userId: number, blockId: string): Promise<any>;
    search(userId: number, query?: string, filter?: any, sort?: any): Promise<any>;
    getUser(userId: number, notionUserId: string): Promise<any>;
    listUsers(userId: number): Promise<any>;
    getBotUser(userId: number): Promise<any>;
    createComment(userId: number, pageId: string, richText: any[]): Promise<any>;
    getComments(userId: number, blockId: string): Promise<any>;
    createParagraphBlock(text: string): any;
    createHeadingBlock(level: 1 | 2 | 3, text: string): any;
    createToDoBlock(text: string, checked?: boolean): any;
    createBulletedListBlock(text: string): any;
    createCodeBlock(code: string, language?: string): any;
    createTitleProperty(text: string): any;
    createRichTextProperty(text: string): any;
    createNumberProperty(number: number): any;
    createSelectProperty(option: string): any;
    createMultiSelectProperty(options: string[]): any;
    createDateProperty(start: string, end?: string): any;
    createCheckboxProperty(checked: boolean): any;
    createUrlProperty(url: string): any;
    createEmailProperty(email: string): any;
    createPhoneProperty(phone: string): any;
}
export declare const notionService: NotionService;
export {};
