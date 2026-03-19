const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Testando conexão com o banco de dados...\n');
    
    // Test basic connection
    const categories = await prisma.category.findMany({ take: 1 });
    console.log('✅ Conexão com banco de dados estabelecida!\n');
    
    // Get stats
    const categoryCount = await prisma.category.count();
    const articleCount = await prisma.article.count();
    const userCount = await prisma.user.count();
    const commentCount = await prisma.comment.count();
    
    console.log('📊 Estatísticas do banco de dados:');
    console.log(`   - Categorias: ${categoryCount}`);
    console.log(`   - Artigos: ${articleCount}`);
    console.log(`   - Usuários: ${userCount}`);
    console.log(`   - Comentários: ${commentCount}`);
    
    // Check if data exists
    if (articleCount === 0) {
      console.log('\n⚠️  AVISO: Nenhum artigo encontrado no banco!');
      console.log('   Verifique se você migrou os dados da DB local para a nuvem.');
    }
    
    if (categoryCount === 0) {
      console.log('\n⚠️  AVISO: Nenhuma categoria encontrada no banco!');
    }
    
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:\n');
    console.error('Tipo de erro:', error.name);
    console.error('Mensagem:', error.message);
    
    if (error.message.includes('authentication failed') || error.message.includes('SCRAM')) {
      console.error('\n💡 Possíveis causas:');
      console.error('   1. Senha incorreta no DATABASE_URL');
      console.error('   2. Usuário não existe no MongoDB Atlas');
      console.error('   3. IP não está liberado no Network Access (Atlas)');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
