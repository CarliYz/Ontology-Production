import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 清理
  await prisma.auditLog.deleteMany();
  await prisma.mapping.deleteMany();
  await prisma.linkType.deleteMany();
  await prisma.property.deleteMany();
  await prisma.objectType.deleteMany();
  await prisma.ontologyVersion.deleteMany();
  await prisma.ontology.deleteMany();

  // 创建默认 Ontology
  const ontology = await prisma.ontology.create({
    data: {
      id: 'ont-default',
      name: '组织架构与供应链图谱',
      description: '核心生产力数据模具',
      status: 'draft',
      objectTypes: {
        create: [
          {
            id: 'ot-001',
            apiName: 'User',
            displayName: '用户 (User)',
            description: '组织内部人员信息',
            primaryKey: 'userId',
            properties: {
              create: [
                { id: 'p-1', apiName: 'userId', displayName: '用户 ID', type: 'string', required: true },
                { id: 'p-2', apiName: 'username', displayName: '姓名', type: 'string' },
                { id: 'p-3', apiName: 'email', displayName: '邮箱', type: 'string' }
              ]
            }
          },
          {
            id: 'ot-002',
            apiName: 'Order',
            displayName: '订单 (Order)',
            description: '业务交易订单记录',
            primaryKey: 'orderId',
            properties: {
              create: [
                { id: 'p-4', apiName: 'orderId', displayName: '订单编号', type: 'string', required: true },
                { id: 'p-5', apiName: 'amount', displayName: '金额', type: 'double' },
                { id: 'p-6', apiName: 'status', displayName: '订单状态', type: 'string' }
              ]
            }
          }
        ]
      },
      linkTypes: {
        create: [
          {
            id: 'lnk-1',
            apiName: 'user_orders',
            displayName: '用户下单关系',
            fromObject: 'User',
            toObject: 'Order',
            cardinality: 'OneToMany'
          }
        ]
      }
    }
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
