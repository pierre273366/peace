const request = require('supertest');
const app = require('../app'); 






//FAIT PAR CARLA
describe('API Routes Tests', () => {
  
    describe('Users Routes', () => {
      it('GET /user/:token - devrait renvoyer les détails utilisateur', async () => {
        const testToken = 'UiUH55zl19gq3T6vaAKY8ut36eMmMsYu';
        
        const response = await request(app)
          .get(`/users/${testToken}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('userDet');
        expect(response.body.userDet).toHaveProperty('token');
        expect(response.body.userDet).toHaveProperty('username');
      });
    });
  });





//FAIT PAR PIERRE
  describe('Balances Routes', () => {
    it('GET /tricount/balances/:id - devrait renvoyer les balances', async () => {
      const testTricountId = '675a9c5f2b983fba29a7a341';
      
      const response = await request(app)
        .get(`/tricount/balances/${testTricountId}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('result');
      expect(response.body).toHaveProperty('balances');
    });
  });





//FAIT PAR BRIEUC
  describe('Todo Routes', () => {
    it('POST /todo/createtodo - devrait créer une nouvelle tâche', async () => {
      const testData = {
        participants: ['657c12345678901234567890', '657c12345678901234567891'],
        colocToken: 'test-token',
        tâche: 'Faire la vaisselle',
        date: '2024-12-20',
        récurrence: 'hebdomadaire'
      };
      
      const response = await request(app)
        .post('/todo/createtodo')
        .send(testData)
        .timeout(10000); 
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('result');
      expect(response.body).toHaveProperty('todo');
    }, 10000); 
});