/**
 * Test to check product data structure from API
 */

async function testProductStructure() {
  try {
    const response = await fetch('http://localhost:5000/api/products');
    const data = await response.json();
    
    console.log('✅ API Response received\n');
    console.log('Response structure:', Object.keys(data));
    console.log('Success:', data.success);
    console.log('Data keys:', Object.keys(data.data || {}));
    
    if (data.data && data.data.products) {
      console.log('\n📦 Products array length:', data.data.products.length);
      
      if (data.data.products.length > 0) {
        const firstProduct = data.data.products[0];
        console.log('\n🔍 First Product Structure:');
        console.log(JSON.stringify(firstProduct, null, 2));
        
        console.log('\n📋 Product Fields:');
        Object.keys(firstProduct).forEach(key => {
          console.log(`  - ${key}: ${typeof firstProduct[key]} = ${JSON.stringify(firstProduct[key]).substring(0, 50)}`);
        });
        
        console.log('\n🆔 Product ID Check:');
        console.log('  _id field exists:', '_id' in firstProduct);
        console.log('  _id value:', firstProduct._id);
        console.log('  _id type:', typeof firstProduct._id);
        console.log('  _id length:', firstProduct._id?.length);
        console.log('  Is valid MongoDB ID format:', /^[a-f\d]{24}$/i.test(firstProduct._id));
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testProductStructure();
