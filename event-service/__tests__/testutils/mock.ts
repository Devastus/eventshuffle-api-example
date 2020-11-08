import typeorm = require("typeorm");

function fakeQueryBuilder(returnValue: any) {
    return jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(returnValue),
        getMany: jest.fn().mockResolvedValue(returnValue),
    });
}

export function mockTypeORM(returnValue: any) {
    typeorm.getRepository = jest.fn().mockReturnValue({
        createQueryBuilder: fakeQueryBuilder(returnValue),
        findOne: jest.fn().mockResolvedValue(returnValue),
        save: jest.fn().mockResolvedValue(returnValue)
    })
}

export function mockContext(request: any = {}): any {
    return {
        params: request.params || {},
        query: request.query || {},
        request: {
            body: request.body || {}
        },
        body: undefined,
        set: jest.fn(),
        throw: (status: any) => { throw status; },
        status: undefined,
    };
}
