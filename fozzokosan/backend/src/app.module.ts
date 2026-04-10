import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RecipesModule } from './recipes/recipes.module';
import { UploadModule } from './upload/upload.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { UnitsModule } from './units/units.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { ShoppingListsModule } from './shopping-lists/shopping-lists.module';
import { NlpModule } from './nlp/nlp.module';
import { MenuPlansModule } from './menu-plans/menu-plans.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        setHeaders: (res) => {
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.setHeader('Content-Disposition', 'inline');
          res.setHeader(
            'Content-Security-Policy',
            "default-src 'none'; img-src 'self'",
          );
        },
      },
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RecipesModule,
    UploadModule,
    LikesModule,
    CommentsModule,
    UnitsModule,
    IngredientsModule,
    ShoppingListsModule,
    NlpModule,
    MenuPlansModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
