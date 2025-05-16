# 이 집! 맛 집? #


### 맛집 등록 사이트 ###

- gpt api와 네이버서치 api를 활용해 맛집을 검색해 등록 후, 한눈에 볼 수 있는 사이트다.

---

### 도커 실행 방법 ###

- window의 경우 powershell(cmd도 되는지 모름), linux의 경우 터미널에서

  컨테이너를 백그라운드에서 실행시키기
  
```
docker-compose up -d
```

- 컨테이너 상태 확인

  ```
  docker-compose ps
  ```

- 컨테이너 중지

  ```
  docker-compose stop #볼륨에 저장된 데이터 유지
  docker-compose down -v # 볼륨에 저장된 것까지 삭제. 이거하면 쌓아놓은 Data다 날아갑니다.
  ```

실행된 db는 docker desktop안에서 확인해 보실 수 있습니다. 거기서 정지버튼을 눌러 정지도 가능합니다.

---

# env.example

# .env 파일의 템플릿입니다. 이 파일을 복사하여 .env 파일을 만들고 실제 값을 채워주세요.

# .env 파일 자체는 Git에 커밋하지 마세요.


DB_USER_LOCAL=postgres

DB_PASSWORD_LOCAL= # 실제 비밀번호를 여기에 적지 마세요. 각자 설정합니다.

DB_NAME_LOCAL=localDB

DB_PORT_LOCAL_HOST=5433


COMPOSE_PROJECT_NAME=myproject
