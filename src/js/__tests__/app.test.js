import read from '../reader.js';
import json from '../parser.js';
import GameSavingLoader from '../app.js';

jest.mock(
    '../reader.js', 
    () => jest.fn()
);

jest.mock(
    '../parser.js', 
    () => jest.fn()
);

test('GameSavingLoader.load should return correct data', async () => {
    read.mockResolvedValue(
        new ArrayBuffer(100)
    );
    json.mockResolvedValue(
        `{
            "id": 9,
            "created": 1546300800,
            "userInfo": {
                "id": 1,
                "name": "Hitman",
                "level": 10,
                "points": 2000
            }
        }`
    );
    const saving = await GameSavingLoader.load();
    expect(saving).toBeDefined();
    expect(saving.id).toBe(9);
    expect(saving.created).toBe(1546300800);
    expect(saving.userInfo).toEqual({
        id: 1,
        name: 'Hitman',
        level: 10,
        points: 2000
    });
});

test('GameSavingLoader.load should throw error when JSON is invalid', async () => {
    read.mockResolvedValue(
        new ArrayBuffer(100)
    );
    json.mockResolvedValue(
        'invalid JSON'
    );
    await expect(GameSavingLoader.load()).rejects.toThrow(
        'Error while loading or parsing data'
    );
});

test('GameSavingLoader.load should throw error when read rejects', async () => {
    read.mockRejectedValue(
        new Error('Read failed')
    );
    await expect(GameSavingLoader.load()).rejects.toThrow(
        'Error while loading or parsing data'
    );
});
