const app = require('../../');
const request = require('supertest');
const should = require('should');
const models = require('../../models');


describe.only('GET /users는', ()=>{
    const users = 
    [{name: 'alice'}, {name: 'bek'}, {name: 'chris'}]
    before(()=> {
        return models.sequelize.sync({force: true})
    });
    // user을 생성
    before(()=>{
        return models.User.bulkCreate(users);
    })

    describe('성공시', ()=> {
       
        // 테이블을 만든다

        it('유저 객체를 담은 배열로 응답한다', (done) => {
            request(app)
                .get('/users')
                .end((err, res) => {
                    res.body.should.be.instanceOf(Array);
                    done();
                });
        });

        it('최대 limit 갯수만큼 응답한다', (done) => {
            request(app)
                .get('/users?limit=2')
                .end((err, res) => {
                    res.body.should.be.lengthOf(2);
                    done();
                });
        });

    })

    describe('실패시', ()=> {
        it('최대 숫자가 아닐경우 400으로 응답한다', (done) => {
            request(app)
                .get('/users?limit=two')
                .expect(400)
                .end(done);
        });
        it('id로 유저를 찾을수 없을 경우 404로 응답한다', (done) => {
            request(app)
                .get('/users/999')
                .expect(404)
                .end(done);
        });
        

    });
});

describe('GET /users/:id 는', ()=>{
    const users = 
    [{name: 'alice'}, {name: 'bek'}, {name: 'chris'}]
    before(()=> {
        return models.sequelize.sync({force: true})
    });
    // user을 생성
    before(()=>{
        return models.User.bulkCreate(users);
    })

     describe ('성공시', ()=> {
         it('id가 1인 유저 객체를 반환한다', (done)=>{
             request(app)
                .get('/users/1')
                .end((err,res) => {
                    res.body.should.have.property('id', 1);
                    done();
                });
         })
     })
     describe ('실패시', ()=> {
        it('id가 숫자가 아닐경우 400으로 응답한다', (done)=>{
            request(app)
               .get('/users/one')
               .expect(400)
               .end(done);
        })
        it('id가 숫자가 아닐경우 404으로 응답한다', (done)=>{
            request(app)
               .get('/users/999')
               .expect(404)
               .end(done);
        })
    })
});

describe('DELETE /users 1는', ()=>{
    const users = 
    [{name: 'alice'}, {name: 'bek'}, {name: 'chris'}]
    before(()=> {
        return models.sequelize.sync({force: true})
    });
    // user을 생성
    before(()=>{
        return models.User.bulkCreate(users);
    })

    describe('성공시', ()=>{
        it('204를 응답했다', (done)=> {
            request(app)
                .delete('/users/1')
                .expect(204)
                .end(done);
        })
    })
    describe('실패시', ()=>{
        it('id가 숫자가 아닐경우 400으로 응답한다', (done)=> {
            request(app)
                .delete('/users/one')
                .expect(400)
                .end(done);
        });
    });
});

describe('POST /users 1는', ()=>{
    const users = 
    [{name: 'alice'}, {name: 'bek'}, {name: 'chris'}]
    before(()=> models.sequelize.sync({force: true}));
    // user을 생성
    before(()=>{
        return models.User.bulkCreate(users);
    })

     describe('성공시', ()=>{ 
        let name = 'daniel'
        let body;
        
        before(done => {
            request(app)
                .post('/users')
                .send({name : name})
                .expect(201)
                .end((err, res) => {
                    body = res.body;
                    done();
                })
        });

        it('생성된 유저 객체를 반환한다', ()=> {
            body.should.have.property('id');
        });
        it('입력한 name을 반환한다', ()=> {
            body.should.have.property('name', name);
        });
        
        it('name 파라미터 누락시 400을 반환한다', done=>{
            request(app)
                .post('/users')
                .send({})
                .expect(400)
                .end(done)
        });

        it('name 중복시 409을 반환한다', done=>{
            request(app)
                .post('/users')
                .send({name: 'alice'})
                .expect(409)
                .end(done)
        });
       
    })
    
});

describe('PUT /users/:id', ()=>{
    const users = 
    [{name: 'alice'}, {name: 'bek'}, {name: 'chris'}]
    before(()=> models.sequelize.sync({force: true}));
    // user을 생성
    before(()=>{
        return models.User.bulkCreate(users);
    })

    describe('성공시' , () => {
        it('변경된 name을 응답한다', (done) => {
            const name = 'chally';
            request(app)
                .put('/users/3')
                .send({name})
                .end((err,res) => {
                    res.body.should.have.property('name', name);
                    done();
                });
        })
    })

    describe('실패시' , () => {
        it('정수가 아닌 id일 경우 400을 응답한다', (done) => {
            request(app)
                .put('/users/one')
                .expect(400)
                .end(done);
        })

        it('name이 없을 경우 400을 응답한다', (done) => {
            request(app)
                .put('/users/1')
                .send({})
                .expect(400)
                .end(done);
        })   
        it('없는 유저일 경우 404을 응답한다', (done) => {
            request(app)
                .put('/users/999')
                .send({name : 'foo'})
                .expect(404)
                .end(done);
        }) 
        it('이름이 중복일 경우 409 응답한다', (done) => {
            request(app)
                .put('/users/3')
                .send({name : 'bek'})
                .expect(409)
                .end(done);
        })      
    })
})
