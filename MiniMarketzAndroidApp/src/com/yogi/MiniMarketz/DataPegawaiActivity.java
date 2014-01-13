package com.yogi.MiniMarketz;

import android.app.ListActivity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created with IntelliJ IDEA.
 * User: Yogi
 * Date: 1/11/14
 * Time: 10:08 AM
 * To change this template use File | Settings | File Templates.
 */
public class DataPegawaiActivity extends ListActivity {

    // url to make request
    //private static String url = "http://api.androidhive.info/contacts/";
    private static String url = "http://192.168.16.13:3000/api/android/datapegawai/";

    // JSON Node names
    private static final String TAG_PEGAWAI = "datapegawai";
    private static final String TAG_ID = "_id";
    private static final String TAG_NAMA = "nama";
    private static final String TAG_UMUR = "umur";
    private static final String TAG_ALAMAT = "alamat";

    // contacts JSONArray
    JSONArray datapegawai = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.pegawai);

        // Hashmap for ListView
        ArrayList<HashMap<String, String>> contactList = new ArrayList<HashMap<String, String>>();

        // Creating JSON Parser instance
        JSONParser jParser = new JSONParser();

        // getting JSON string from URL
        JSONObject json = jParser.getJSONFromUrl(url);

        try {
            // Getting Array of Pegawai
            datapegawai = json.getJSONArray(TAG_PEGAWAI);

            // looping through All Pegawai
            for(int i = 0; i < datapegawai.length(); i++){
                JSONObject c = datapegawai.getJSONObject(i);

                // Storing each json item in variable
                String id = c.getString(TAG_ID);
                String nama = c.getString(TAG_NAMA);
                String umur = c.getString(TAG_UMUR);
                String alamat = c.getString(TAG_ALAMAT);
                //String email = c.getString(TAG_EMAIL);
                //String address = c.getString(TAG_ADDRESS);
                //String gender = c.getString(TAG_GENDER);

                // Phone number is agin JSON Object
                //JSONObject phone = c.getJSONObject(TAG_PHONE);
                //String mobile = phone.getString(TAG_PHONE_MOBILE);
                //String home = phone.getString(TAG_PHONE_HOME);
                //String office = phone.getString(TAG_PHONE_OFFICE);

                // creating new HashMap
                HashMap<String, String> map = new HashMap<String, String>();

                // adding each child node to HashMap key => value
                map.put(TAG_ID, id);
                map.put(TAG_NAMA, nama);
                map.put(TAG_UMUR, umur);
                map.put(TAG_ALAMAT, alamat);
                //map.put(TAG_EMAIL, email);
                //map.put(TAG_PHONE_MOBILE, mobile);

                // adding HashList to ArrayList
                contactList.add(map);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }


        /**
         * Updating parsed JSON data into ListView
         * */
        ListAdapter adapter = new SimpleAdapter(this, contactList,
                R.layout.list_item,
                new String[] { TAG_ID, TAG_NAMA, TAG_ALAMAT }, new int[] {
                R.id._id, R.id.nama, R.id.alamat });

        setListAdapter(adapter);

        // selecting single ListView item
        ListView lv = getListView();

        // Launching new screen on Selecting Single ListItem
        lv.setOnItemClickListener(new AdapterView.OnItemClickListener() {

            @Override
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {
                // getting values from selected ListItem
                String name = ((TextView) view.findViewById(R.id.nama)).getText().toString();
                //String cost = ((TextView) view.findViewById(R.id.email)).getText().toString();
                //String description = ((TextView) view.findViewById(R.id.mobile)).getText().toString();

                // Starting new intent
                Intent in = new Intent(getApplicationContext(), SingleMenuItemActivity.class);
                in.putExtra(TAG_NAMA, name);
                //in.putExtra(TAG_EMAIL, cost);
                //in.putExtra(TAG_PHONE_MOBILE, description);
                startActivity(in);

            }
        });



    }

}
